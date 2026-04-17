// lib/supabase.ts
// MOCKED VERSION FOR OFFLINE/LOCAL DEVELOPMENT

const createMockProxy = (data: any = null) => {
  const handler = {
    get: (target: any, prop: string): any => {
      // Mock methods used in the app
      if (['select', 'insert', 'update', 'delete', 'match', 'eq', 'single', 'order', 'limit'].includes(prop)) {
        return () => createMockProxy(data);
      }
      
      // Return the mock result
      if (prop === 'then') {
        return (resolve: any) => resolve({ data, error: null });
      }

      // Chainable
      return createMockProxy(data);
    }
  };
  return new Proxy({}, handler);
};

export const supabase = {
  auth: {
    signUp: async ({ email }: { email: string }) => ({
      data: { user: { id: 'mock-user-id', email } },
      error: null
    }),
    signInWithPassword: async ({ email }: { email: string }) => ({
      data: { user: { id: 'mock-user-id', email } },
      error: null
    }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (cb: any) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table: string) => {
    // If it's a select for specific tables, we could return mock data here
    // But we'll handle actual data management in Zustand (store.ts)
    return createMockProxy(null);
  },
  channel: () => createMockProxy(),
  removeChannel: () => {},
  removeAllChannels: () => {}
};
