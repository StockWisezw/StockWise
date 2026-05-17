// AI services file connecting to Supabase Edge Functions
import { supabase } from '../lib/supabase';

// AI Insights for Inventory
export const generateInventoryInsights = async (inventoryData: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('insights', {
      body: { 
        query: `You are an expert AI business analyst for retail and wholesale businesses in Zimbabwe.
Given the following inventory data, provide 3 to 5 actionable insights on stock levels, fast-moving items, and reorder alerts. Keep it concise.

Inventory Data: ${JSON.stringify(inventoryData)}`
      }
    });

    if (error) {
      throw error;
    }

    return data?.result || 'No insights generated.';
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return 'Unable to generate AI insights at the moment. Please check your API key / Supabase configuration.';
  }
};
