# Backend Tool Guides
## How to add a Flyway migration

- Go to `BE/src/main/resources/db/migration`
- Add a new sql file and name it appropriately (`Vx__some_name.sql`; **where x = any positive integer greater than that of the last migration (should keep it consistent and make it so that x = lastVersion + 1)**)
- Write the script that should execute on your migration (e.g. if you wanna add a new column you do an ALTER COLUMN on the target table)
- ***Make sure the Flyway migration script and Hibernate entity match***

N.B. **Hibernate will not persist automatically in the DB, it just validates if entities match with the existing DB tables**

## How to generate a TypeScript REST client on your machine
### IMPORTANT: Make sure the OpenAPI annotations on the backend controllers are up-to-date!
- Run the task `openApiGenerate` under task group `openapi tools`
- Update `api.ts` from `FE/src/api` if needed by adding or removing api declarations

N.B. The generated client has the same methods as the controllers, including matching names if possible. ***In special cases like having a method for an endpoint called*** `delete` ***the generator will use*** `_delete` ***because*** `delete` ***is a reserved word in TS.***

## How to allow or dissallow endpoint access based on user role/authentication status
- Go to `BE/src/main/java/com/example/config/SecurityConfig.java`
- In the function `securityFilterChain` add another method to the chain as shown bellow:
```java
@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                        // users sending a delete request to /tasks/any/endpoint/path must have the role of admin
                        .requestMatchers(HttpMethod.DELETE, "/tasks/**").hasRole("ADMIN") 
                        // everyone, authenticated or not, can access these endpoints
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        // users must be authenticated for every other endpoint
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
```