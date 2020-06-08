/**
 * (c) 2018 HAWKORE, S.L. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * A copy of the license terms has been included with this distribution in the LICENSE.md file.
 * ---
 * Derechos de Autor (C) 2018 HAWKORE, S.L. - Todos los derechos reservados
 * Se prohibe estrictamente la copia sin autorización de este fichero por cualquier medio
 * Propietario y confidencial
 *
 * Se incluye una copia de los términos de la licencia en el archivo LICENSE.md en esta distribución.
 */
package com.hawkore.mule.apacheignite.example.rt;

import com.hawkore.test.HawkoreEmployee;

/**
 * @author jose
 */
public class CacheDataInitializerHandler {

    public static final HawkoreEmployee arturo = new HawkoreEmployee("1", "Arturo", "Sanz de la Torre",
        "arturo.sanz@hawkore.com", "Co-founder");
    public static final HawkoreEmployee manuel = new HawkoreEmployee("2", "Manuel", "Núñez Sánchez",
        "manuel.nunez@hawkore.com", "Co-founder");
    public static final HawkoreEmployee jose = new HawkoreEmployee("3", "José", "Peñalba Morales",
        "jose.penalba@hawkore.com", "Co-founder & CTO");
    public static final HawkoreEmployee[] all = new HawkoreEmployee[] { arturo, manuel, jose };

    public static Object all() throws Exception {
        return all;
    }

}