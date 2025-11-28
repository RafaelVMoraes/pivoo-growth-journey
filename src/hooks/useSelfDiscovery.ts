import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
  is_focus_area?: boolean;
}

interface ValuesData {
  value_name: string;
  selected: boolean;
}

interface VisionData {
  vision_1y?: string;
  vision_3y?: string;
  word_year?: string;
  phrase_year?: string;
}

const LIFE_AREAS_BY_CATEGORY = {
  'Life Quality': [
    'Health & Energy',
    'Mental & Emotional Well-being',
    'Lifestyle & Leisure'
  ],
  'Personal': [
    'Personal Growth & Learning',
    'Spirituality / Purpose',
    'Contribution / Community'
  ],
  'Professional': [
    'Career & Mission',
    'Finances',
    'Physical Environment'
  ],
  'Relationships': [
    'Relationships & Social Life',
    'Love & Partnership',
    'Family'
  ]
};

const LIFE_AREAS = Object.values(LIFE_AREAS_BY_CATEGORY).flat();

const PREDEFINED_VALUES = {
  'Identity & Integrity': ['Authenticity', 'Responsibility', 'Honesty', 'Discipline', 'Courage', 'Reliability'],
  'Growth & Mastery': ['Learning', 'Curiosity', 'Excellence', 'Innovation', 'Resilience', 'Ambition'],
  'Connection & Community': ['Empathy', 'Belonging', 'Collaboration', 'Diversity', 'Family', 'Generosity'],
  'Well-being & Balance': ['Health', 'Stability', 'Mindfulness', 'Joy', 'Simplicity', 'Peace'],
  'Purpose & Impact': ['Freedom', 'Contribution', 'Creativity', 'Sustainability', 'Leadership', 'Vision']
};

export const useSelfDiscovery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lifeWheelData, setLifeWheelData] = useState<LifeWheelData[]>([]);
  const [valuesData, setValuesData] = useState<ValuesData[]>([]);
  const [visionData, setVisionData] = useState<VisionData>({});
  const [saving, setSaving] = useState(false);

  // Initialize default data
  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      // Initialize with default values for guest mode
      initializeDefaults();
    }
  }, [user]);

  const initializeDefaults = () => {
    setLifeWheelData(LIFE_AREAS.map(area => ({
      area_name: area,
      current_score: 5,
      desired_score: 8,
      is_focus_area: false
    })));

    const allValues: ValuesData[] = [];
    Object.values(PREDEFINED_VALUES).flat().forEach(value => {
      allValues.push({ value_name: value, selected: false });
    });
    setValuesData(allValues);
    setVisionData({});
  };

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchLifeWheel(),
        fetchValues(),
        fetchVision()
      ]);
    } catch (error) {
      console.error('Error fetching self-discovery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLifeWheel = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('life_wheel')
      .select('area_name, current_score, desired_score, is_focus_area')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching life wheel:', error);
      return;
    }

    // Initialize with default values and merge with existing data
    const defaultData = LIFE_AREAS.map(area => ({
      area_name: area,
      current_score: 5,
      desired_score: 8,
      is_focus_area: false
    }));

    const mergedData = defaultData.map(defaultArea => {
      const existing = data.find(d => d.area_name === defaultArea.area_name);
      return existing ? { ...existing, is_focus_area: existing.is_focus_area || false } : defaultArea;
    });

    setLifeWheelData(mergedData);
  };

  const fetchValues = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('values')
      .select('value_name, selected')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching values:', error);
      return;
    }

    // Initialize all predefined values
    const allValues: ValuesData[] = [];
    Object.values(PREDEFINED_VALUES).flat().forEach(value => {
      const existing = data?.find(d => d.value_name === value);
      allValues.push({
        value_name: value,
        selected: existing?.selected || false
      });
    });

    // Add custom values (values not in predefined list)
    data?.forEach(d => {
      const isPredefined = Object.values(PREDEFINED_VALUES).flat().includes(d.value_name);
      if (!isPredefined) {
        allValues.push({
          value_name: d.value_name,
          selected: d.selected
        });
      }
    });

    setValuesData(allValues);
  };

  const fetchVision = async () => {
    if (!user) return;

    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('vision')
      .select('vision_1y, vision_3y, word_year, phrase_year')
      .eq('user_id', user.id)
      .eq('year', currentYear)
      .maybeSingle();

    if (error) {
      console.error('Error fetching vision:', error);
      return;
    }

    setVisionData(data || {});
  };

  const updateLifeWheel = async (areaName: string, updates: Partial<LifeWheelData>) => {
    // Update local state immediately (optimistic update)
    setLifeWheelData(prev => prev.map(item => 
      item.area_name === areaName ? { ...item, ...updates } : item
    ));

    if (!user) return; // Guest mode

    setSaving(true);
    try {
      const currentData = lifeWheelData.find(d => d.area_name === areaName);
      const dataToUpsert: any = {
        user_id: user.id,
        area_name: areaName,
        current_score: updates.current_score !== undefined ? updates.current_score : (currentData?.current_score || 5),
        desired_score: updates.desired_score !== undefined ? updates.desired_score : (currentData?.desired_score || 8),
      };
      
      // Include is_focus_area if provided
      if (updates.is_focus_area !== undefined) {
        dataToUpsert.is_focus_area = updates.is_focus_area;
      }
      
      const { error } = await supabase
        .from('life_wheel')
        .upsert(dataToUpsert, {
          onConflict: 'user_id,area_name'
        });

      if (error) throw error;
      
      toast({
        title: "Saved",
        description: "Life wheel updated successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error updating life wheel:', error);
      toast({
        title: "Error",
        description: "Couldn't save changes, please retry",
        variant: "destructive",
      });
      // Revert optimistic update
      fetchLifeWheel();
    } finally {
      setSaving(false);
    }
  };

  const updateValues = async (valueName: string, selected: boolean) => {
    // Check if user is trying to select more than 7 values
    const currentSelected = valuesData.filter(v => v.selected).length;
    if (selected && currentSelected >= 7) {
      toast({
        title: "Maximum reached",
        description: "You can select up to 7 values only",
        variant: "destructive",
      });
      return;
    }

    // Update local state immediately (optimistic update)
    setValuesData(prev => prev.map(item => 
      item.value_name === valueName ? { ...item, selected } : item
    ));

    if (!user) return; // Guest mode

    setSaving(true);
    try {
      const { error } = await supabase
        .from('values')
        .upsert({
          user_id: user.id,
          value_name: valueName,
          selected
        }, {
          onConflict: 'user_id,value_name'
        });

      if (error) throw error;
      
      toast({
        title: "Saved",
        description: "Values updated successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error updating values:', error);
      toast({
        title: "Error", 
        description: "Couldn't save changes, please retry",
        variant: "destructive",
      });
      // Revert optimistic update
      fetchValues();
    } finally {
      setSaving(false);
    }
  };

  const updateVision = async (updates: Partial<VisionData>) => {
    // Update local state immediately (optimistic update)
    setVisionData(prev => ({ ...prev, ...updates }));

    if (!user) return; // Guest mode

    setSaving(true);
    try {
      const currentYear = new Date().getFullYear();
      const { error } = await supabase
        .from('vision')
        .upsert({
          user_id: user.id,
          year: currentYear,
          ...visionData,
          ...updates
        }, {
          onConflict: 'user_id,year'
        });

      if (error) throw error;
      
      toast({
        title: "Saved",
        description: "Vision updated successfully", 
        duration: 2000,
      });
    } catch (error) {
      console.error('Error updating vision:', error);
      toast({
        title: "Error",
        description: "Couldn't save changes, please retry",
        variant: "destructive",
      });
      // Revert optimistic update  
      fetchVision();
    } finally {
      setSaving(false);
    }
  };

  const selectedValuesCount = valuesData.filter(v => v.selected).length;

  return {
    loading,
    saving,
    lifeWheelData,
    valuesData,
    visionData,
    selectedValuesCount,
    updateLifeWheel,
    updateValues,
    updateVision,
    PREDEFINED_VALUES,
    LIFE_AREAS,
    LIFE_AREAS_BY_CATEGORY
  };
};