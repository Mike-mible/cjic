
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nifjzpxrhngeaqxyeqww.supabase.co';
const supabaseKey = 'sb_publishable_trbY2r-3DFnDLEi1i7yc3w_0GzWFIOR';

export const supabase = createClient(supabaseUrl, supabaseKey);
