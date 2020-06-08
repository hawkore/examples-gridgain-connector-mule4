package com.hawkore.mule.apacheignite.example.rt;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Utils {
    
    private static final Logger logger = LoggerFactory.getLogger(Utils.class);

    public static InputStream stream(String s) {
        return new ByteArrayInputStream(s.getBytes());
    }

    public static String fail(String v) {
        if ("true".equals(v)) {
            throw new ForcedFailException();
        }
        return "ok";
    }

    public static boolean isIllegalStateException(final Object e) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, ClassNotFoundException {
        
    	Class errorClass = Class.forName("org.mule.runtime.api.message.Error");
    	
    	Method descMethod = errorClass.getMethod("getDescription");
    	
    	return e != null && descMethod.invoke(e) != null && ((String)descMethod.invoke(e)).contains("ForcedFailException");
    }

    public static String sleep(long millis) throws InterruptedException {
        logger.debug("sleep: waiting " + millis + " milliseconds at thread " + Thread.currentThread().getName());
        Thread.sleep(millis);
        return "ok";
    }

    public static String toString(Object o) {
        return o == null ? null : o.toString();
    }

    public static String concat(Object o, Object o2) {
        return (o == null ? null : o.toString()) + "-" + (o2 == null ? null : o2.toString());
    }

    public static class ForcedFailException extends RuntimeException {

        /**
         * 
         */
        private static final long serialVersionUID = -7510513604825311435L;

    }
}
