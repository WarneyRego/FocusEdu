import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateStudyPlan } from '../lib/gemini';
import type { StudyPlan } from '../types';
import { motion, AnimatePresence } from 'framer-motion';


export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [subjects, setSubjects] = useState(['']);
  const [hoursPerDay, setHoursPerDay] = useState(2);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      toast.error('Erro ao carregar planos de estudo');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, '']);
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleGeneratePlan = async () => {
    const filteredSubjects = subjects.filter(subject => subject.trim() !== '');
    if (filteredSubjects.length === 0) {
      toast.error('Adicione pelo menos uma matéria');
      return;
    }

    setGenerating(true);
    try {
      const generatedPlan = await generateStudyPlan(filteredSubjects, hoursPerDay);
      
      const { error } = await supabase.from('study_plans').insert({
        user_id: user?.id,
        subjects: filteredSubjects,
        hours_per_day: hoursPerDay,
        schedule: generatedPlan.schedule
      });

      if (error) throw error;

      toast.success('Plano de estudo gerado com sucesso!');
      fetchPlans();
      setSubjects(['']);
      setHoursPerDay(2);
    } catch (error) {
      toast.error('Erro ao gerar plano de estudo');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('study_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast.success('Plano de estudo excluído');
      setPlans(plans.filter(plan => plan.id !== planId));
    } catch (error) {
      toast.error('Erro ao excluir plano de estudo');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-purple-400"
          >
            Plano de Estudos
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </motion.button>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 border border-gray-700"
        >
          <h2 className="text-lg font-medium mb-4 text-purple-300">
            Gerar novo plano de estudos
          </h2>
          <div className="space-y-4">
            <AnimatePresence>
              {subjects.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder="Nome da matéria"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {subjects.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveSubject(index)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
  
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddSubject}
              className="inline-flex items-center px-4 py-2 border border-purple-500 rounded-md text-sm font-medium text-purple-300 hover:bg-purple-500 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar matéria
            </motion.button>
  
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Horas por dia
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
  
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGeneratePlan}
              disabled={generating}
              className="w-full flex justify-center items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando plano...
                </>
              ) : (
                'Gerar plano de estudos'
              )}
            </motion.button>
          </div>
        </motion.div>
  
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-lg font-medium mb-4 text-purple-300">Meus planos de estudo</h2>
          {loading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-purple-400" />
            </div>
          ) : plans.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              Nenhum plano de estudo gerado ainda.
            </p>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-purple-300">
                          Matérias: {plan.subjects.join(', ')}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {plan.hours_per_day} horas por dia
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
  
                    <div className="space-y-2">
                      {plan.schedule.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-600 p-3 rounded"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-purple-300">
                              {item.subject}
                            </span>
                            <span className="text-gray-400">{item.duration}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{item.focus}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
  
}