import { z } from 'zod';

const BookSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  genre: z.string().min(1).max(50),
  rating: z.number().min(0).max(5),
  review: z.string().max(2000)
});



export default BookSchema;