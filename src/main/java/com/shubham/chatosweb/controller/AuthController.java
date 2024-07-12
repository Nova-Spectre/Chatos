package com.shubham.chatosweb.controller;


import com.shubham.chatosweb.config.TokenProvider;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.repository.UserRepository;
import com.shubham.chatosweb.request.LoginRequest;
import com.shubham.chatosweb.response.AuthResponse;
import com.shubham.chatosweb.service.CustomUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private TokenProvider tokenProvider;
    private CustomUserService customUserService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider, CustomUserService customUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.customUserService = customUserService;
    }


    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException {
        String email=user.getEmail();
        String full_name=user.getFullname();
        String password=user.getPassword();


        User isUser=userRepository.findByEmail(email);
        if(isUser!=null){
            throw new UserException("Email is used with another account"+email);
        }

        User createdUser=new User();
        createdUser.setEmail(email);
        createdUser.setFullname(full_name);
        createdUser.setPassword(passwordEncoder.encode(password));

        userRepository.save(createdUser);

        Authentication authentication=new UsernamePasswordAuthenticationToken(email,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt=tokenProvider.generateToken(authentication);
        AuthResponse res=new AuthResponse(jwt,true);
        return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);



    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse>  loginHandler(@RequestBody LoginRequest req){

        String email= req.getEmail();
        String password=req.getPassword();

        Authentication authentication=authentication(email,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt=tokenProvider.generateToken(authentication);
        AuthResponse res=new AuthResponse(jwt,true);

        return new ResponseEntity<AuthResponse>(res,HttpStatus.ACCEPTED);

    }

    public Authentication authentication(String username,String password){
        UserDetails userDetails= customUserService.loadUserByUsername(username);

        if(userDetails==null){
            throw new BadCredentialsException("invalid username");
        }
        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw  new BadCredentialsException("invalid  password or username");
        }
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }



}
