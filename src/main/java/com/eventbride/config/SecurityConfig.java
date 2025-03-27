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
                        // URIS DE PROOVEDOR
                        .requestMatchers(
                                "/api/venues/delete/{id}",
                                "/api/venues/add-venue/**",
                                "/api/event-properties/{eventPropertiesId}",
                                "/api/event-properties/pending/{userId}",
                                "/api/event-properties/status/pending/{eventPropertiesId}",
                                "/api/other-services/disable/**",
                                "/api/users/plan",
                                "/api/services/**",
                                "/api/users/profile/plan")
                        .hasAuthority("SUPPLIER")

                        // URIS DE CLIENTE
                        .requestMatchers(
                                "/api/venues",
                                "/api/v1/events",
                                "/api/v1/events/{id}",
                                "/api/v1/events/next/**",
                                "/api/event-properties/DTO/**",
                                "/api/event-properties/cancel/**",
                                "/api/event-properties/{eventId}/add-otherservice/{otherServiceId}",
                                "/api/event-properties/cancel/{eventPropertieID}",
                                "/api/invitation/eventInvitations/**",
                                "/api/invitation/**",
                                "/api/invitation/create/**",
                                "/api/other-services",
                                "/api/other-services/{id}",
                                "/api/event-properties/{eventId}/add-venue/{venueId}/**",
                                "/api/venues")
                        .hasAuthority("CLIENT")

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
                                "/api/chat/**")
                        .permitAll()

                        .requestMatchers("/api/services/admin",
                                "/api/users/**",
                                "/api/**",
                                "/api/v1/events/DTO",
                                "/api/other-services/admin/**",
                                "/api/venues/admin/**")
                        .hasRole("ADMIN")
                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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
