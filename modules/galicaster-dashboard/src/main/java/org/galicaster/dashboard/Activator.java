/**
 * Copyright (c) 2013, Teltek Video Research <galicaster@teltek.es>
 *
 * This work is licensed under the Creative Commons Attribution-
 * NonCommercial-ShareAlike 3.0 Unported License. To view a copy of 
 * this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ 
 * or send a letter to Creative Commons, 171 Second Street, Suite 300, 
 * San Francisco, California, 94105, USA.
 *
 */

package org.galicaster.dashboard;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Activator implements BundleActivator {

  /**
   * the logging facility provided by log4j
   */
  private static final Logger logger = LoggerFactory.getLogger(Activator.class);

  @Override
  public void start(BundleContext context) throws Exception {
    logger.info("Starting Galicaster Dashboard");
  }

  @Override
  public void stop(BundleContext context) throws Exception {
    logger.info("Stopped Galicaster Dashboard");
  }
}
