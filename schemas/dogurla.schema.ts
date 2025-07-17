import * as z from 'zod';

export const dogrulaSchema = z.object({
  tc: z
    .string()
    .min(11, 'Tc kimlik 11 karakterden oluşmalıdır.')
    .max(11, 'Tc kimlik 11 karakterden oluşmalıdır.')
    .regex(/^[0-9]*$/, 'Tc kimlik sadece rakamlar içermelidir.')
    .nonempty('Boş bırakmayın.'),
  ad: z.string().min(2, 'Minimum 2 karakter.').max(50, 'Maksimum 50 karakter.').nonempty('Boş bırakmayın.'),
  soyad: z.string().min(2, 'Minimum 2 karakter.').max(50, 'Maksimum 50 karakter.').nonempty('Boş bırakmayın.'),
  dogumTarihi: z
    .string()
    .min(10, 'Minimum 10 karakter.')
    .max(10, 'Maksimum 10 karakter.')
    .regex(/[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/, 'Lütfen istenilen biçimde doğum tarihini girin.')
    .nonempty('Boş bırakmayın.'),
});

export type DogrulaType = z.infer<typeof dogrulaSchema>;
