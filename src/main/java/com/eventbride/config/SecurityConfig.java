package com.eventbride.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.eventbride.config.jwt.services.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private UserDetailsServiceImpl userDetailsSer;

        @Autowired
        private JWTAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable()) // Desactiva CSRF para facilitar pruebas
                                .authorizeHttpRequests(auth -> auth

                                                // URIS PÚBLICAS
                                                .requestMatchers("/api/auth/**",
                                                                "/api/users",
                                                                "/api/users/**",
                                                                "/api/users/auth/register",
                                                                "/api/users/auth/login",
                                                                "/api/users/auth/current-user",
                                                                "/api/payment/**",
                                                                "/ws/**",
                                                                "/ws/info/**",
                                                                "/api/chat/**",
                                                                "/api/venues/{id}",
                                                                "/api/venues",
                                                                "/api/other-services",
                                                                "/api/invitation/**",
                                                                "/api/other-services/{id}")
                                                .permitAll()

                                                // URIS DE ADMIN
                                                .requestMatchers(
                                                                "/api/services/admin",
                                                                "/api/other-services/admin/{id}")
                                                .hasAuthority("ADMIN")

                                                // URIS DE SUPPLIER
                                                .requestMatchers(
                                                                "/api/services/user/{id}",
                                                                "/api/services/solicitudes/{id}",
                                                                "/api/venues/delete/{id}",
                                                                "/api/venues/add-venue/**",
                                                                "/api/other-services/disable/**",
                                                                "/api/event-properties/{eventPropertiesId}",
                                                                "/api/event-properties/pending/{userId}",
                                                                "/api/event-properties/status/pending/{eventPropertiesId}",
                                                                "/api/users/plan",
                                                                "/api/users/planExpired/{id}")
                                                .hasAnyAuthority("SUPPLIER", "ADMIN") // 🔹 Admin también puede acceder

                                                // URIS DE CLIENTE
                                                .requestMatchers(
                                                                "/api/v1/events",
                                                                "/api/v1/events/{id}",
                                                                "/api/v1/events/next/**",
                                                                "/api/event-properties/DTO/**",
                                                                "/api/event-properties/cancel/**",
                                                                "/api/event-properties/{eventId}/add-otherservice/{otherServiceId}",
                                                                "/api/event-properties/{eventId}/add-venue/{venueId}",
                                                                "/api/event-properties/cancel/{eventPropertieID}",
                                                                "/api/invitation/eventInvitations/{eventId}",
                                                                "/api/invitation/**",
                                                                "/api/invitation/create/**")
                                                .hasAnyAuthority("CLIENT", "ADMIN")
                                                .anyRequest().authenticated())
                                .sessionManagement(manager -> manager
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider()).addFilterBefore(
                                                jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                /*
                 * .formLogin(login -> login.disable()) // Desactiva el formulario de login por
                 * defecto
                 * .httpBasic(httpBasic -> httpBasic.disable())
                 */; // Desactiva la autenticación HTTP básica

                return http.build();
        }

        @Bean
        public AuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
                daoAuthenticationProvider.setUserDetailsService(userDetailsSer);
                daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
                return daoAuthenticationProvider;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }
}
