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

package org.galicaster.dashboard.test;

import junit.framework.Assert;

import org.galicaster.dashboard.snapshot.GstreamerSnapshotTaker;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.net.URISyntaxException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Ignore
public class GstreamerSnapshotTakerTest {

  //private static final Logger logger = LoggerFactory.getLogger(GstreamerSnapshotTakerTest.class);

  private static File baseDir;
  private static final String baseDirName = "testDir";
  private static final String destName = "cousa.png";
  private File destFile;


  @BeforeClass
  public static void setUpClass() throws URISyntaxException {
    baseDir = new File(new File(GstreamerSnapshotTaker.class.getResource("/").toURI()), baseDirName);
    if (!baseDir.isDirectory())
      Assert.assertTrue("Failed to create test base directory", baseDir.mkdir());
  }

  @Before
  public void setUp() {
    destFile = new File(baseDir, destName);
    if (destFile.isFile()) {
      destFile.delete();
    }
    Assert.assertFalse("Destination file already exists on setup", destFile.exists());
  }

  @After
  public void tearDown() {
    if (destFile.isFile())
      Assert.assertTrue("Failed to delete destination file on teardown", destFile.delete());
  }

  @Test @Ignore
  public void testSnapshot() {
    GstreamerSnapshotTaker snapshot = null;
    File newFile = null;
    try {
      newFile = Executors.newSingleThreadExecutor().submit(snapshot).get(10, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
      Assert.fail("Executor was interrupted while waiting for the snapshot");
    } catch (ExecutionException e) {
      Assert.fail("The snapshot taker threw an exception: " + e.getCause().toString());
    } catch (TimeoutException e) {
      snapshot.interrupt();
      Assert.fail("The snapshot exception took too long");
    }
    Assert.assertEquals("Created file does not match the expected location", newFile, destFile);
    Assert.assertTrue("Destination file not created", destFile.isFile());
    Assert.assertTrue("Destination file is empty", destFile.length() > 0);
  }
}
