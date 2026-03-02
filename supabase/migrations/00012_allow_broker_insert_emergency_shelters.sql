-- Allow Housing Partner accounts (account_type='broker') to add emergency shelters
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'emergency_shelters'
      AND policyname = 'Brokers can insert emergency shelters'
  ) THEN
    CREATE POLICY "Brokers can insert emergency shelters"
      ON emergency_shelters
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM profiles
          WHERE profiles.id = auth.uid()
            AND profiles.account_type = 'broker'
        )
      );
  END IF;
END $$;
