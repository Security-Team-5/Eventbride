package com.eventbride.user;

import com.eventbride.event.EventService;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.rating.RatingService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueService;
import com.eventbride.rating.Rating;
import com.eventbride.event.Event;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;

import com.eventbride.dto.UserDTO;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private VenueService venueService;

    @Autowired
    private OtherServiceService otherServiceService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/DTO")
    public ResponseEntity<List<UserDTO>> getAllUsersDTO() {
        List<UserDTO> users = userService.getAllUsersDTO();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> user = Optional.ofNullable(userService.getUserByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")));
        return ResponseEntity.ok(user);
    }

    /**
     * Registrar un nuevo usuario.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        logger.info("Intentando registrar usuario: {}", user.getUsername());

        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody User updatedUser) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
            List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
            if (roles.contains("ADMIN")) {
                try {
                    Optional<User> existingUser = userService.getUserById(id);
                    if (existingUser.isEmpty()) {
                        return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
                    }
                    updatedUser.setId(id);
                    User savedUser = userService.updateUser(id, updatedUser);
                    return new ResponseEntity<>(new UserDTO(savedUser), HttpStatus.OK);
                } catch (RuntimeException e) {
                    return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
                }
            }
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Eliminar un usuario por ID.
     */
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") Integer id) {
        if (userService.getUserById(id) != null) {
            List<Event> events = eventService.findEventsByUserId(id);
            for (Event e : events) {
                e.setUser(null);
            }
            eventService.saveAll(events);

            List<Rating> ratings = ratingService.findRatingsByUserId(id);
            for (Rating r : ratings) {
                r.setUser(null);
            }
            ratingService.saveAll(ratings);

            List<Venue> venues = venueService.getVenuesByUserId(id);
            for (Venue v : venues) {
                v.setUser(null);
            }
            venueService.saveAll(venues);

            List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(id);
            for (OtherService os : otherServices) {
                os.setUser(null);
            }
            otherServiceService.saveAll(otherServices);

            userService.deleteUser(id);
        }
    }

    @PutMapping("/api/users/profile/plan")
    public ResponseEntity<?> updateUserPlan(@Valid @RequestBody User updatedUser) {
        try {
            Optional<User> existingUser = userService.getUserById(updatedUser.getId());
            if (existingUser.isEmpty()) {
                return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }
            User savedUser = userService.updateUser(updatedUser.getId(), updatedUser);
            return new ResponseEntity<>(new UserDTO(savedUser), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Editar el perfil de un usuario por ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOwnProfile(@PathVariable Integer id, @Valid @RequestBody User updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth);
        try {
            Optional<User> existingUser = userService.getUserById(id);
            if (existingUser.isEmpty()) {
                return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }
            User savedUser = userService.updateUser(id, updatedUser);
            return new ResponseEntity<>(new UserDTO(savedUser), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
