export const codeSnippets: Record<string, { language: string; code: string }> = {
  React: {
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';

// Custom Hook for fetching data
export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};`
  },
  TypeScript: {
    language: 'typescript',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Generic function to filter array
function filterByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter((item) => item[key] === value);
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
];

const admins = filterByProperty(users, 'role', 'admin');`
  },
  'React Query': {
    language: 'typescript',
    code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, postTodo } from '../api/todos';

export const useTodos = () => {
  const queryClient = useQueryClient();

  // Query
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return { todos, isLoading, addTodo: mutation.mutate };
};`
  },
  Tailwind: {
    language: 'css',
    code: `/* Tailwind Config Example */
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3b82f6',
        'brand-secondary': '#10b981',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }
  }
}

/* Usage in Component */
// <div className="flex items-center justify-center h-screen bg-gray-100">
//   <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
//     Click Me
//   </button>
// </div>`
  },
  'Framer Motion': {
    language: 'typescript',
    code: `import { motion } from 'framer-motion';

export const AnimatedCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <h2>Animated Content</h2>
    <p>This card animates on mount and interaction.</p>
  </motion.div>
);`
  }
};
