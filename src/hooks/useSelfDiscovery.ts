import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
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

const LIFE_AREAS = ['Plenitude', 'Hobbies', 'Relationship', 'Career', 'Financial', 'Health'];

const PREDEFINED_VALUES = {
  Growth: ['Learning', 'Achievement', 'Excellence', 'Innovation', 'Wisdom', 'Progress'],
  Freedom: ['Independence', 'Autonomy', 'Flexibility', 'Adventure', 'Travel', 'Choice'],
  Connection: ['Family', 'Friendship', 'Love', 'Community', 'Belonging', 'Service'],
  Creativity: ['Art', 'Expression', 'Beauty', 'Imagination', 'Design', 'Music'],
  Stability: ['Security', 'Peace', 'Balance', 'Health', 'Comfort', 'Order']
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
      desired_score: 8
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
      .select('area_name, current_score, desired_score')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching life wheel:', error);
      return;
    }

    // Initialize with default values and merge with existing data
    const defaultData = LIFE_AREAS.map(area => ({
      area_name: area,
      current_score: 5,
      desired_score: 8
    }));

    const mergedData = defaultData.map(defaultArea => {
      const existing = data.find(d => d.area_name === defaultArea.area_name);
      return existing || defaultArea;
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
      const { error } = await supabase
        .from('life_wheel')
        .upsert({
          user_id: user.id,
          area_name: areaName,
          current_score: currentData?.current_score || 5,
          desired_score: currentData?.desired_score || 8,
          ...updates
        }, {
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
    LIFE_AREAS
  };
};