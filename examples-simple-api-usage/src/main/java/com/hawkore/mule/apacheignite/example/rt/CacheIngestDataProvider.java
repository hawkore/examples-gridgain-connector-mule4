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

import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

import javax.cache.expiry.ExpiryPolicy;

import com.hawkore.ignite.extensions.api.ingestion.ICacheDataProvider;
import com.hawkore.ignite.extensions.api.ingestion.IngestionProgressNotifier;
import com.hawkore.ignite.extensions.api.ingestion.IngestionResult;

/**
 * @author jose
 */
public class CacheIngestDataProvider implements ICacheDataProvider<String, String, String>, Supplier<String>,
    Predicate<String>,
    IngestionProgressNotifier {

    private final String[] entries;
    private final IngestionResult status;
    private int counter = 0;

    public CacheIngestDataProvider(String data) {
        entries = data.split(":");
        status = new IngestionResult(entries.length);
    }
    
    // Factory method
    
    public static CacheIngestDataProvider create(String data) {
        return new CacheIngestDataProvider(data);
    }
    
    // 

    @Override
    public Supplier<String> getDataSupplier() {
        return this;
    }

    @Override
    public Predicate<String> getFilter() {
        return this;
    }

    @Override
    public Function<String, String> getTransformer() {
        return this::createInstance;
    }

    @Override
    public Function<String, String> getKeyResolver() {
        return this::resolveKey;
    }

    @Override
    public Function<String, ExpiryPolicy> getExpiryPolicier() {
        return null;
    }

    @Override
    public IngestionProgressNotifier getProgressNotifier() {
        return this;
    }

    // Supplier<String>

    @Override
    public String get() {
        synchronized (this.status) {
            if (this.counter < entries.length) {
                return entries[this.counter++];
            } else {
                return null;
            }
        }
    }

    // Predicate<String>

    @Override
    public boolean test(final String t) {
        return true;
    }

    // IngestionProgressNotifier

    @Override
    public void notify(final IngestionResult result) {
        synchronized (status) {
            this.status.setPartialElapsedTime(this.status.getPartialElapsedTime() + result.getPartialElapsedTime());
            this.status.setPartialSent(this.status.getPartialSent() + result.getPartialSent());
            if (result.isFinished()) {
                this.status.setElapsedTime(this.status.getElapsedTime() + result.getElapsedTime());
                this.status.setFinished(result.isFinished());
                this.status.setProcessed(this.status.getProcessed() + result.getProcessed());
                this.status.setSent(this.status.getSent() + result.getSent());
            }
        }
    }

    @Override
    public IngestionResult getIngestionResult() {
        return this.status;
    }

    // Absstract method to implement

    private String createInstance(final String s) {
        return s;
    }

    private String resolveKey(final String t) {
        return t;
    }
}
