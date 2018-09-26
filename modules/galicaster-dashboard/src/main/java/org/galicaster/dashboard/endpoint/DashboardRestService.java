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

package org.galicaster.dashboard.endpoint;

import org.opencastproject.util.NotFoundException;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.galicaster.dashboard.DashboardService;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
public class DashboardRestService {
  private static final Logger logger = LoggerFactory.getLogger(DashboardRestService.class);
  private DashboardService service;

  private static final String FILE_ATTACHMENT_FIELD_NAME = "snapshot";

  protected void activate(ComponentContext cc) {
    logger.info("Galicaster REST Endpoint activated");
  }

  protected void deactivate(ComponentContext cc) {
    logger.info("Galicaster REST Endpoint deactivated");
  }

  /**
   * Callback from OSGi that is called when this service is activated.
   * 
   * @param cc
   *          OSGi component context
   */
  public void setService(DashboardService service) {
    this.service = service;
  }

  public void unsetService(DashboardService service) {
    this.service = null;
  }

  @GET
  @Path("agents/{name}")
  public Response isActive(@PathParam("name") String name) {
    try {
    if (service.isActive(name))
      return Response.noContent().build();
    else
      throw new WebApplicationException(Response.Status.NOT_FOUND);
    } catch (NotFoundException e) {
      throw new WebApplicationException(e, Response.Status.NOT_FOUND);
    }
  }

  @GET
  @Path("agents/{name}/snapshot.png")
  @Produces("image/png")
  public Response getSnapshot(@PathParam("name") String name) throws IOException {
    try {
      File retFile = service.getSnapshot(name);
      return Response.ok(retFile).header("Content-Length", retFile.length())
              .header("Content-Type", "image/png").build();
    } catch (NotFoundException e) {
      throw new WebApplicationException(e, Response.Status.NOT_FOUND);
    } catch (Exception e) {
      logger.error("Received exception {}: {}", e.getClass().getCanonicalName(), e.getMessage());
      throw new WebApplicationException(e, Response.Status.INTERNAL_SERVER_ERROR);
    }
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Path("agents/{name}/snapshot.png")
  public Response setSnapshot(@PathParam("name") String agentName, @Context HttpServletRequest request) throws IOException {
    try {
      if (ServletFileUpload.isMultipartContent(request)) {
        for (FileItemIterator iter = new ServletFileUpload().getItemIterator(request); iter.hasNext();) {
          FileItemStream item = iter.next();
          if (FILE_ATTACHMENT_FIELD_NAME.equals(item.getFieldName())) {
            service.setSnapshot(agentName, item.openStream());
            return Response.noContent().build();
          }
        }
      }

      return Response.status(Response.Status.BAD_REQUEST).build();
    } catch (NotFoundException e) {
      throw new WebApplicationException(e, Response.Status.NOT_FOUND);
    } catch (Exception e) {
      logger.error("Received exception {}: {}", e.getClass().getCanonicalName(), e.getMessage());
      throw new WebApplicationException(e, Response.Status.INTERNAL_SERVER_ERROR);
    } 
  }
}