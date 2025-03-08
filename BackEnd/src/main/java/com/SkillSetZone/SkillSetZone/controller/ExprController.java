package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.Expr;
import com.SkillSetZone.SkillSetZone.Service.ExprService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expr")
public class ExprController {
    private ExprService exprService;

    @Autowired
    public ExprController(ExprService exprService) {
        this.exprService = exprService;
    }

    @PostMapping("/create")
    public Expr create(@RequestPart(value = "file", required = false) MultipartFile image,
                       @RequestParam("experience") String experience) throws IOException {
        return exprService.saveExpr(experience, image);
    }

    @DeleteMapping("/delete/{id}")
    public Optional<Expr> delete(@PathVariable String id) throws IOException {
        return exprService.deleteExpr(id);
    }

    @GetMapping("/all")
    public List<Expr> getAll() throws IOException {
        return exprService.exprList();
    }

    @GetMapping("/user-email/{email}")
    public List<Expr> getUserExperiencesByEmail(@PathVariable String email) throws IOException {
        return exprService.getExprByEmail(email);
    }
}