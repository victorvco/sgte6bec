-- Create arranchamento entries table
CREATE TABLE public.arranchamento_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  nome_guerra TEXT NOT NULL,
  graduacao TEXT NOT NULL,
  om TEXT NOT NULL,
  cafe_segunda BOOLEAN NOT NULL DEFAULT false,
  cafe_terca BOOLEAN NOT NULL DEFAULT false,
  cafe_quarta BOOLEAN NOT NULL DEFAULT false,
  cafe_quinta BOOLEAN NOT NULL DEFAULT false,
  cafe_sexta BOOLEAN NOT NULL DEFAULT false,
  almoco_segunda BOOLEAN NOT NULL DEFAULT false,
  almoco_terca BOOLEAN NOT NULL DEFAULT false,
  almoco_quarta BOOLEAN NOT NULL DEFAULT false,
  almoco_quinta BOOLEAN NOT NULL DEFAULT false,
  almoco_sexta BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.arranchamento_entries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert entries (public form)
CREATE POLICY "Anyone can insert entries" 
ON public.arranchamento_entries 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read entries (for admin table view)
CREATE POLICY "Anyone can view entries" 
ON public.arranchamento_entries 
FOR SELECT 
USING (true);

-- Allow anyone to delete entries (admin can delete)
CREATE POLICY "Anyone can delete entries" 
ON public.arranchamento_entries 
FOR DELETE 
USING (true);