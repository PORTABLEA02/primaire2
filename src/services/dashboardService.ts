import { supabase } from '../lib/supabase';

export const dashboardService = {
  // Récupérer les statistiques du tableau de bord
  async getDashboardStats() {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        total_students: 0,
        total_teachers: 0,
        total_classes: 0,
        active_year: '2024-2025',
        monthly_revenue: 0,
        outstanding_payments: 0
      };
    }
    
    return data;
  },

  // Récupérer les activités récentes
  async getRecentActivities(limit: number = 10) {
    // First, get the activity logs with user_id
    const { data: activityLogs, error: logsError } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        table_name,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (logsError) {
      console.error('Erreur lors de la récupération des activités:', logsError);
      return [];
    }

    if (!activityLogs || activityLogs.length === 0) {
      return [];
    }

    // Extract unique user IDs
    const userIds = [...new Set(activityLogs.map(log => log.user_id).filter(Boolean))];

    // Fetch user profiles for these IDs
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Erreur lors de la récupération des profils utilisateurs:', profilesError);
    }

    // Create a map of user ID to full name for quick lookup
    const userMap = new Map();
    userProfiles?.forEach(profile => {
      userMap.set(profile.id, profile.full_name);
    });

    return activityLogs.map(log => ({
      id: log.id,
      type: log.table_name || 'système',
      title: log.action,
      description: `Action sur ${log.table_name}`,
      time: new Date(log.created_at).toLocaleString('fr-FR'),
      user: userMap.get(log.user_id) || 'Système'
    }));
  },

  // Récupérer la répartition académique
  async getAcademicOverview() {
    const { data, error } = await supabase
      .from('levels')
      .select(`
        name,
        classes (
          id,
          students (id)
        )
      `)
      .order('order_number', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération de la répartition académique:', error);
      return [];
    }

    return data?.map(level => ({
      level: level.name,
      students: level.classes?.reduce((sum, cls) => sum + (cls.students?.length || 0), 0) || 0,
      classes: level.classes?.length || 0,
      trend: 'up', // À calculer selon vos besoins
      percentage: Math.random() * 10 // Simulation, à remplacer par un vrai calcul
    })) || [];
  }
};