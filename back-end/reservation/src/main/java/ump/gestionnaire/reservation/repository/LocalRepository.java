/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package ump.gestionnaire.reservation.repository;

/**
 *
 * @author yahya
 */

import org.springframework.data.jpa.repository.JpaRepository;
import ump.gestionnaire.reservation.entity.Local;

public interface LocalRepository extends JpaRepository<Local, Integer> {}

