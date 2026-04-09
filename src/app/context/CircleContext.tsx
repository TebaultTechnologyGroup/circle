// context/CircleContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource"; // Adjust path to your resource file

const client = generateClient<Schema>();

type CircleContextType = {
  currentCircle: Schema["Circle"]["type"] | null;
  userRole: string | null;
  isLoading: boolean;
};

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export function CircleProvider({ children }: { children: React.ReactNode }) {
  const { circleId } = useParams(); // Automatically syncs with the URL
  const [data, setData] = useState<Omit<CircleContextType, "isLoading">>({
    currentCircle: null,
    userRole: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!circleId) {
      setData({ currentCircle: null, userRole: null });
      return;
    }

    async function loadCircleContext() {
      setIsLoading(true);
      try {
        const [circleRes, memberRes] = await Promise.all([
          client.models.Circle.get({ id: circleId || "" }),
          client.models.CircleMember.list({
            filter: { circleId: { eq: circleId } },
            // In a real app, you'd also filter by current user ID
          }),
        ]);

        setData({
          currentCircle: circleRes.data || null,
          userRole: memberRes.data?.[0]?.role || null,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCircleContext();
  }, [circleId]);

  return (
    <CircleContext.Provider value={{ ...data, isLoading }}>
      {children}
    </CircleContext.Provider>
  );
}

export const useCircle = () => {
  const context = useContext(CircleContext);
  if (!context)
    throw new Error("useCircle must be used within a CircleProvider");
  return context;
};
