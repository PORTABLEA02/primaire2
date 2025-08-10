import { supabase } from '../lib/supabase';
import type { Grade } from '../lib/supabase';

export interface CreateGradeData {
  studentId: string;
  subjectId: string;
  classId: string;
  academicPeriodId: string;
  grade: number;
  coefficient: number;
  evaluationType: 'devoir' | 'composition' | 'interrogation';
  evaluationTitle?: string;
  evaluationDate: string;
  teacherComment?: string;
}

export interface ClassGradeEntry {
  studentId: string;
  grade: number;
  comment?: string;
}

export const gradeService = {
  // Récupérer les notes d'un élève pour une période
  async getStudentGrades(studentId: string, academicPeriodId?: string) {
    let query = supabase
      .from('grades')
      .select(`
        *,
        subjects (name, coefficient),
        classes (name),
        academic_periods (name)
      `)
      .eq('student_id', studentId);

    if (academicPeriodId) {
      query = query.eq('academic_period_id', academicPeriodId);
    }

    const { data, error } = await query.order('evaluation_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Récupérer les notes d'une classe pour une matière et période
  async getClassGrades(classId: string, subjectId: string, academicPeriodId: string) {
    const { data, error } = await supabase
      .from('grades')
      .select(`
        *,
        students (
          id,
          first_name,
          last_name
        ),
        subjects (name, coefficient)
      `)
      .eq('class_id', classId)
      .eq('subject_id', subjectId)
      .eq('academic_period_id', academicPeriodId)
      .order('students(last_name)', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer les élèves d'une classe pour la saisie de notes
  async getStudentsForGradeEntry(className: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        first_name,
        last_name,
        classes!inner (name),
        attendance (
          status,
          attendance_date
        ),
        grades (
          grade,
          evaluation_date,
          subjects (name)
        )
      `)
      .eq('classes.name', className)
      .eq('status', 'Actif')
      .order('last_name', { ascending: true });

    if (error) throw error;

    return data?.map(student => {
      // Calculer le taux de présence
      const totalDays = 30; // Approximation pour un mois
      const presentDays = student.attendance?.filter(a => a.status === 'Présent').length || 0;
      const attendance = Math.round((presentDays / totalDays) * 100);

      // Récupérer la dernière note
      const lastGrade = student.grades?.[0]?.grade;

      return {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        currentGrade: null,
        previousGrade: lastGrade,
        attendance: attendance
      };
    }) || [];
  },

  // Saisir les notes pour une classe entière
  async enterClassGrades(
    classId: string,
    subjectId: string,
    academicPeriodId: string,
    evaluationType: 'devoir' | 'composition' | 'interrogation',
    evaluationTitle: string,
    evaluationDate: string,
    coefficient: number,
    grades: ClassGradeEntry[]
  ) {
    // Get the current user ID first
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    const gradeInserts = grades
      .filter(g => g.grade !== null && g.grade !== undefined)
      .map(g => ({
        student_id: g.studentId,
        subject_id: subjectId,
        class_id: classId,
        academic_period_id: academicPeriodId,
        grade: g.grade,
        coefficient,
        evaluation_type: evaluationType,
        evaluation_title: evaluationTitle,
        evaluation_date: evaluationDate,
        teacher_comment: g.comment,
        created_by: currentUserId
      }));

    const { data, error } = await supabase
      .from('grades')
      .insert(gradeInserts)
      .select();

    if (error) throw error;
    return data;
  },

  // Calculer les moyennes d'une classe pour une période
  async calculateClassAverages(classId: string, academicPeriodId: string) {
    const { data, error } = await supabase.rpc('calculate_class_averages', {
      class_id: classId,
      period_id: academicPeriodId
    });

    if (error) throw error;
    return data;
  },

  // Récupérer les moyennes par matière pour une classe
  async getSubjectAverages(classId: string, academicPeriodId: string) {
    const { data, error } = await supabase
      .from('grades')
      .select(`
        subject_id,
        grade,
        coefficient,
        subjects (name)
      `)
      .eq('class_id', classId)
      .eq('academic_period_id', academicPeriodId);

    if (error) throw error;

    // Calculer les moyennes par matière
    const subjectAverages = data?.reduce((acc, grade) => {
      const subjectName = grade.subjects?.name || '';
      if (!acc[subjectName]) {
        acc[subjectName] = {
          subject: subjectName,
          grades: [],
          totalCoefficient: 0
        };
      }
      acc[subjectName].grades.push(grade.grade * (grade.coefficient || 1));
      acc[subjectName].totalCoefficient += (grade.coefficient || 1);
      return acc;
    }, {} as Record<string, any>) || {};

    // Calculer les moyennes finales
    Object.keys(subjectAverages).forEach(subject => {
      const subjectData = subjectAverages[subject];
      subjectData.average = subjectData.grades.reduce((sum: number, g: number) => sum + g, 0) / subjectData.totalCoefficient;
    });

    return Object.values(subjectAverages);
  },

  // Mettre à jour une note
  async updateGrade(id: string, updates: Partial<Grade>) {
    const { data, error } = await supabase
      .from('grades')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une note
  async deleteGrade(id: string) {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};