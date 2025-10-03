import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../.env') });

const MONGO_URL = process.env.MONGO_URL;
const TOTAL_BOOKS = 50;
const TOTAL_AUTHORS = 10;

const authorNames = [
  'J.K. Rowling',
  'Stephen King',
  'George R.R. Martin',
  'Neil Gaiman',
  'Dan Brown',
  'Paulo Coelho',
  'Haruki Murakami',
  'Margaret Atwood',
  'John Green',
  'George Orwell',
];

const genres = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Historical Fiction',
  'Literary Fiction',
  'Horror',
  'Adventure',
  'Dystopian',
];

type Author = {
  _id: mongoose.Types.ObjectId;
  name: string;
  bio: string;
  birthDate: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

type Book = {
  title: string;
  description: string;
  publishedAt: string;
  authors: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

async function generateAuthors(): Promise<Author[]> {
  const authors: Author[] = [];
  for (let i = 0; i < TOTAL_AUTHORS; i++) {
    const author: Author = {
      _id: new mongoose.Types.ObjectId(),
      name: authorNames[i],
      bio: `${authorNames[i]} is a renowned author known for ${faker.lorem.paragraph()}`,
      birthDate: faker.date
        .between({ from: '1920-01-01', to: '1990-12-31' })
        .toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    authors.push(author);
  }
  return authors;
}

async function generateBooks(authors: Author[]): Promise<Book[]> {
  const books: Book[] = [];
  for (let i = 0; i < TOTAL_BOOKS; i++) {
    const genre = faker.helpers.arrayElement(genres);
    const title = `The ${faker.word.adjective()} ${faker.word.noun()} of ${faker.word.noun()}`;
    const publishYear = faker.date.between({
      from: '1990-01-01',
      to: '2023-12-31',
    });

    const book: Book = {
      title,
      description: `A ${genre} novel about ${faker.lorem.paragraph()}`,
      publishedAt: publishYear.toISOString(),
      authors: faker.helpers.arrayElements(
        authors.map((author) => author._id),
        { min: 1, max: 3 },
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    books.push(book);
  }
  return books;
}

async function seed() {
  try {
    if (!MONGO_URL) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const authorCount = await mongoose.connection
      .collection('authors')
      .countDocuments();
    const bookCount = await mongoose.connection
      .collection('books')
      .countDocuments();

    if (authorCount === 0) {
      const authors = await generateAuthors();
      await mongoose.connection.collection('authors').insertMany(authors);
      console.log(`Inserted ${authors.length} authors`);
    } else {
      console.log(`Authors collection already has ${authorCount} documents`);
    }

    // Need to fetch authors (either just inserted or already present)
    const authors = await mongoose.connection
      .collection('authors')
      .find()
      .toArray();

    if (bookCount === 0) {
      const mappedAuthors = authors.map((a) => ({
        _id: a._id,
        name: a.name,
        bio: a.bio,
        birthDate: a.birthDate,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        isDeleted: a.isDeleted,
      }));
      const books = await generateBooks(mappedAuthors);
      await mongoose.connection.collection('books').insertMany(books);
      console.log(`Inserted ${books.length} books`);
    } else {
      console.log(`Books collection already has ${bookCount} documents`);
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
