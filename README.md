# UBB-Proiect-Colectiv-G06-Echipa-1

Link Figma: https://www.figma.com/design/zOSuTj3yuZmgXZnAM1XeV2/Untitled?node-id=0-1&t=7jLdvUaFMdztQEd3-1

## How to add a Flyway migration

- Go to **resources/db/migration** in the backend's root
- Add a new sql file and name it appropriately (**Vx__some_name.sql; where x = any positive integer greater than that of the last migration (should keep it consistent and make it so that x = lastVersion + 1)**)
- Write the script that should execute on your migration (e.g. if you wanna add a new column you do an ALTER COLUMN on the target table)
- ***Make sure the Flyway migration script and Hibernate entity match***

N.B. **Hibernate will not persist automatically in the DB, it just validates if entities match with the existing DB tables**