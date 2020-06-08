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

import java.util.ArrayList;

public class MessageRegistry {

	private static final ArrayList<String> messages = new ArrayList<>();

	private MessageRegistry() {
	}

	public static String[] removeAll() {
		String[] objs;
		synchronized (messages) {
			objs = messages.toArray(new String[messages.size()]);
			messages.clear();
		}
		return objs;
	}

	public static void add(String s) {
		synchronized (messages) {
			messages.add(s);
		}
	}

}
