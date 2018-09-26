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

package org.galicaster.dashboard.snapshot;

import org.opencastproject.capture.admin.api.Agent;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.Callable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This class implements a simple "snapshot taker" based on a Gstramer pipeline that connects via VNC to capture the screen
 *
 */
public class GstreamerSnapshotTaker implements Callable<File> {

  private static final Logger logger = LoggerFactory.getLogger(GstreamerSnapshotTaker.class);
  private static final String EXEC_NAME = "gst-launch";
  public static final String DEFAULT_RFB_VERSION = "3.0";

  /** Default extension for the snapshots extracted from the agents*/
  public static final String IMAGE_EXTENSION = ".png"; 
 
  private File destFile;
  private Agent agent;
  private String password, rfbVersion;

  Process p = null;

  public static final String pipeStr = "%s " +
                  "rfbsrc host=\"%s\" view-only=true password=\"%s\" version=\"%s\" num-buffers=1 ! " +
                  "ffmpegcolorspace ! " +
                  "pngenc ! " +
                  "filesink location=\"%s\"";


  public GstreamerSnapshotTaker(Agent agent, File destDir) throws IOException {
    this(agent, destDir, null, null);
  }

  public GstreamerSnapshotTaker(Agent agent, File destDir, String password) throws IOException {
    this(agent, destDir, password, null);
  }

  public GstreamerSnapshotTaker(Agent agent, File destDir, String password, String rfbVersion) throws IOException {

    if (agent == null)
      throw new NullPointerException("The agent must not be null");

    this.destFile = new File(destDir, agent.getName() + IMAGE_EXTENSION);
    this.agent = agent;
    this.password = password == null ? "" : password;
    this.rfbVersion = rfbVersion == null ? DEFAULT_RFB_VERSION : rfbVersion;
  };


  @Override
  public File call() {

    // Marks the file to be deleted on exist, if an error occurred
    boolean deleteOnExit = true;
    
    ProcessBuilder pb = new ProcessBuilder(
            splitCommandArguments(
                    String.format(pipeStr,
                            EXEC_NAME,
                            agent.getUrl(),
                            password,
                            rfbVersion,
                            destFile.getAbsolutePath()
                            )
                    )
            );

    Scanner s = null; 
    try {
      p = pb.start();

      if (p.waitFor() != 0) {
        s = new Scanner(p.getErrorStream()).useDelimiter("\\A");
        String error = s.hasNext() ? s.next() : "";

        error = String.format("The subprocess returned error code %s: %s", p.exitValue(), error);
        logger.error(error);
        throw new RuntimeException(error);
      }

      if (!destFile.isFile())
        throw new RuntimeException("The subprocess did not create a file");

      deleteOnExit = false;
      
      return destFile;

    } catch (IOException e) {
      logger.error("Error when initiating the helper subprocess: {}", e.getMessage());
      throw new RuntimeException("Error when initiating the helper subprocess.", e);
    } catch (InterruptedException e) {
      logger.error("The subprocess was unexpectedly interrupted: {}", e.getMessage());
      throw new RuntimeException("The subprocess was unexpectedly interrupted.", e);
    } finally {
      if (s != null)
        s.close();
      if (deleteOnExit)
        FileUtils.deleteQuietly(destFile);
    }

  }

  /**
   * Interrupts the pipeline
   */
  public void interrupt() {
    p.destroy();
  }

  // This pattern matches:
  // - Any set of non-whitespaces that aren't surrounded by quotation marks (either single or double).
  // - Any set of characters, either whitespace or not, surrounded by single or double quotation marks.
  // - A combination of both (as in file('this is a file').
  // Please note:
  // - Escaped quotation marks are treated as normal characters (i.e. do not mark the beginning nor the end of a quoted area).
  // - Nesting quotation marks of different types has no effect (i.e. "this sentence 'matches fully'" and 'this sentence "also does" ').
  // - The quotation marks, if they are present, are not removed.
  // - The capture group 2, if not null, matches the last quoted part found, without the quotation marks..
  //   So, if the group 2's length equals the whole match length minus 2, then the group 2 equals the whole match without the quotation marks.
  private static final Pattern pattern = Pattern.compile("(?:(?:(?<!\\\\)([\'\"])(.*?)(?<!\\\\)\\1)|\\S)+");

  private List<String> splitCommandArguments(final String commandline) {
    final List<String> list = new LinkedList<String>();

    final Matcher m = pattern.matcher(commandline);
      
    while (m.find()) {
      // We want to remove the outer quotation marks only if the whole match is quoted.
      // For instance, in  param="This is the param", the last quotation mark shouldn't be removed.
      if ((m.group(2) != null) && (m.group(2).length() == m.group().length() - 2))
        list.add(m.group(2));
      else
        list.add(m.group());
    }
    return list;
  }
}
