-- Remove nome and om columns from arranchamento_entries table
ALTER TABLE public.arranchamento_entries DROP COLUMN nome;
ALTER TABLE public.arranchamento_entries DROP COLUMN om;