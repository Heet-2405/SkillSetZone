package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.Expr;
import com.SkillSetZone.SkillSetZone.Repo.ExprRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ExprService {
    private ExprRepository exprRepository;

    @Autowired
    public ExprService(ExprRepository exprRepository) {
        this.exprRepository = exprRepository;
    }

    private String getAuthenticatedEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

    public Expr saveExpr(String expr, MultipartFile image) throws IOException {
        Expr expr1 = new Expr();
        String email = getAuthenticatedEmail();
        expr1.setExperience(expr);
        expr1.setEmail(email);
        if (image != null) {
            expr1.setImage(image.getBytes());
        }
        return exprRepository.save(expr1);
    }

    public List<Expr> exprList() throws IOException {
        String email = getAuthenticatedEmail();
        return exprRepository.findAllByEmail(email);
    }

    public Optional<Expr> deleteExpr(String id) throws IOException {
        String email = getAuthenticatedEmail();
        Optional<Expr> expr = exprRepository.findById(id);
        if (expr.isPresent()) {
            exprRepository.deleteById(id);
        }
        return expr;
    }

    public List<Expr> getExprByEmail(String email) {
        return exprRepository.findAllByEmail(email);
    }
}