
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS show_related_global BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS show_related BOOLEAN;
DELETE FROM public.features WHERE title = 'تغليف هدايا مجاني';
