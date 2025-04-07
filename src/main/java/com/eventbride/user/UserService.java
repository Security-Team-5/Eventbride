package com.eventbride.user;

import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import com.eventbride.venue.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.eventbride.service.Service;
import com.eventbride.dto.UserDTO;
import com.eventbride.user.User.Plan;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

	@Autowired
	private OtherServiceRepository otherServiceRepository;

	@Autowired
	private VenueRepository	venueRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsersDTO() {
        List<User> users = userRepository.findAll();
        return UserDTO.fromEntities(users);
    }

    @Transactional
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    @Transactional
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User registerUser(User user)  throws IllegalArgumentException{
        if (user.getId() != null) {
            throw new IllegalArgumentException("No se puede registrar un usuario con ID preexistente");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        if (user.getProfilePicture()==null || user.getProfilePicture()==""){
            user.setProfilePicture("https://cdn-icons-png.flaticon.com/512/17/17004.png");
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Integer id, User userDetails) throws IllegalArgumentException {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Comprueba si el username al que se quiere actualizar ya está en uso
        if (!user.getUsername().equals(userDetails.getUsername()) &&
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        // Comprueba si el email al que se quiere actualizar ya está en uso
        if (!user.getEmail().equals(userDetails.getEmail()) &&
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está en uso");
        }

        // Comprueba si el DNI al que se quiere actualizar ya está en uso
        if (!user.getDni().equals(userDetails.getDni()) &&
            userRepository.existsByDni(userDetails.getDni())) {
            throw new IllegalArgumentException("El DNI ya está registrado");
        }
        if (user.getProfilePicture()==null || user.getProfilePicture()==""){
            user.setProfilePicture("https://cdn-icons-png.flaticon.com/512/17/17004.png");
        }

        // Validar el formato del telefono
        if (!String.valueOf(userDetails.getTelephone()).matches("^[0-9]{9}$")) {
            throw new IllegalArgumentException("El teléfono debe tener 9 números");
        }

        // Actualizar los campos del usuario
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setTelephone(userDetails.getTelephone());
        user.setDni(userDetails.getDni());
        user.setRole(userDetails.getRole());
        user.setPlan(userDetails.getPlan());
        user.setPaymentPlanDate(userDetails.getPaymentPlanDate());
        user.setExpirePlanDate(userDetails.getExpirePlanDate());
        user.setProfilePicture(userDetails.getProfilePicture());
        user.setReceivesEmails(userDetails.getReceivesEmails());

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User save(User user) throws DataAccessException {
        return userRepository.save(user);
    }

    @Transactional
    public User downgradeUserPlan(User user)  throws IllegalArgumentException {
		LocalDate date = LocalDate.now();
		if(user.getPlan().equals(Plan.PREMIUM) && user.getExpirePlanDate().isBefore(date)){
			user.setPlan(Plan.BASIC);
			user.setPaymentPlanDate(null);
			user.setExpirePlanDate(null);

			List<OtherService> otherServices = otherServiceRepository.findByUserId(user.getId());
			List<Venue> venues = venueRepository.findByUserId(user.getId());

			List<Service> services = new ArrayList<>();
			services.addAll(otherServices);
			services.addAll(venues);

			// Poner todos a false
			services.stream().forEach(s ->{
				s.setAvailable(false);
			});

			services.stream().limit(3).forEach(s ->{
				s.setAvailable(true);
			});

			// Se guardan en la base de datos
			otherServiceRepository.saveAll(otherServices);
			venueRepository.saveAll(venues);

			return userRepository.save(user);
		}
		return user;
    }

    public User setPremium(Integer id, LocalDate expirationDate)  throws IllegalArgumentException {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        user.setPlan(User.Plan.PREMIUM);
        user.setPaymentPlanDate(LocalDate.now());
        user.setExpirePlanDate(expirationDate);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserByRole(String role ) throws IllegalArgumentException {
        return userRepository.findByRole(role).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    public Optional<User> getUserByEmail(String currentEmail) {
        return userRepository.findByEmail(currentEmail);
    }

}
