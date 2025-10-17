import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { LessonPlan, CreateLessonPlanInput } from '@/types/lessonPlan';

const STORAGE_KEY = '@lesson_plans';

export const [LessonPlansProvider, useLessonPlans] = createContextHook(() => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLessonPlans();
  }, []);

  const loadLessonPlans = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLessonPlans(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading lesson plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLessonPlans = async (plans: LessonPlan[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      setLessonPlans(plans);
    } catch (error) {
      console.error('Error saving lesson plans:', error);
    }
  };

  const addLessonPlan = useCallback((input: CreateLessonPlanInput) => {
    const newPlan: LessonPlan = {
      ...input,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...lessonPlans, newPlan];
    saveLessonPlans(updated);
    return newPlan;
  }, [lessonPlans]);

  const updateLessonPlan = useCallback((id: string, input: Partial<CreateLessonPlanInput>) => {
    const updated = lessonPlans.map(plan =>
      plan.id === id
        ? { ...plan, ...input, updatedAt: new Date().toISOString() }
        : plan
    );
    saveLessonPlans(updated);
  }, [lessonPlans]);

  const deleteLessonPlan = useCallback((id: string) => {
    const updated = lessonPlans.filter(plan => plan.id !== id);
    saveLessonPlans(updated);
  }, [lessonPlans]);

  const getLessonPlan = useCallback((id: string) => {
    return lessonPlans.find(plan => plan.id === id);
  }, [lessonPlans]);

  return useMemo(() => ({
    lessonPlans,
    isLoading,
    addLessonPlan,
    updateLessonPlan,
    deleteLessonPlan,
    getLessonPlan,
  }), [lessonPlans, isLoading, addLessonPlan, updateLessonPlan, deleteLessonPlan, getLessonPlan]);
});

export const useLessonPlanStats = () => {
  const { lessonPlans } = useLessonPlans();

  return useMemo(() => {
    const total = lessonPlans.length;
    const byGrade = lessonPlans.reduce((acc, plan) => {
      acc[plan.grade] = (acc[plan.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const byCampo = lessonPlans.reduce((acc, plan) => {
      acc[plan.campoFormativo] = (acc[plan.campoFormativo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byGrade, byCampo };
  }, [lessonPlans]);
};

export const useFilteredLessonPlans = (searchQuery: string, gradeFilter: string, campoFilter: string) => {
  const { lessonPlans } = useLessonPlans();

  return useMemo(() => {
    return lessonPlans.filter(plan => {
      const matchesSearch = searchQuery === '' || 
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === '' || plan.grade === gradeFilter;
      const matchesCampo = campoFilter === '' || plan.campoFormativo === campoFilter;
      return matchesSearch && matchesGrade && matchesCampo;
    });
  }, [lessonPlans, searchQuery, gradeFilter, campoFilter]);
};
