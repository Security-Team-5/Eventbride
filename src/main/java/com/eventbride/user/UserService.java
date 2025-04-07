package com.eventbride.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.dto.UserDTO;
import com.eventbride.notification.Notification;
import com.eventbride.notification.NotificationRepository;
import com.eventbride.notification.NotificationService;
import com.eventbride.user.User.Plan;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

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
    public User registerUser(User user) {
        if (user.getId() != null) {
            throw new RuntimeException("No se puede registrar un usuario con ID preexistente");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("El username ya está en uso");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        if (user.getProfilePicture()==null || user.getProfilePicture()==""){
            user.setProfilePicture("https://cdn-icons-png.flaticon.com/512/17/17004.png");
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Integer id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
        // Comprueba si el username al que se quiere actualizar ya está en uso
        if (!user.getUsername().equals(userDetails.getUsername()) && 
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }
    
        // Comprueba si el email al que se quiere actualizar ya está en uso
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está en uso");
        }
    
        // Comprueba si el DNI al que se quiere actualizar ya está en uso
        if (!user.getDni().equals(userDetails.getDni()) && 
            userRepository.existsByDni(userDetails.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }
        if (user.getProfilePicture()==null || user.getProfilePicture()==""){
            user.setProfilePicture("https://cdn-icons-png.flaticon.com/512/17/17004.png");
        }
    
        // Validar el formato del telefono
        if (!String.valueOf(userDetails.getTelephone()).matches("^[0-9]{9}$")) {
            throw new RuntimeException("El teléfono debe tener 9 números");
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
    public User downgradeUserPlan(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setPlan(Plan.BASIC);
        user.setPaymentPlanDate(null);
        user.setExpirePlanDate(null);
        notificationService.createNotification(Notification.NotificationType.PLAN_EXPIRED, user, null, null, null);
        return userRepository.save(user);

    }

    public User setPremium(Integer id, LocalDate expirationDate) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setPlan(User.Plan.PREMIUM);
        user.setPaymentPlanDate(LocalDate.now());
        user.setExpirePlanDate(expirationDate);
        notificationService.createNotification(Notification.NotificationType.PLAN_UPGRADED, user, null, null, null);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserByRole(String role ) throws Exception {
        return userRepository.findByRole(role).orElseThrow(() -> new Exception("Usuario no encontrado"));
    }
  
}
