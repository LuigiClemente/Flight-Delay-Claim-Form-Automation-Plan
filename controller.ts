import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../../utils/interfaces";
import HttpException from "../../utils/exception/exception";
import AdminService from "./service";
import validate from "./validation";
import {
  authenticatedMiddleware,
  validationMiddleware,
} from "../../middlewares";
import fetch from "node-fetch";

class AdminController implements Controller {
  public path = "/user";
  public router = Router();
  private adminService = new AdminService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.post(`${this.path}/logout`, this.logout);

    this.router.get(`${this.path}/refresh`, this.refresh);

    this.router.post(`${this.path}/form1`, this.sendForm1Data);

    this.router.post(`${this.path}/form2`, this.sendForm2Data);
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { login, password } = req.body;

      const token = (await this.adminService.login(login, password)) as {
        accessToken: string;
        refreshToken: string;
      };

      res.cookie("refreshToken", token.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json({data: token});
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { refreshToken } = req.cookies;

      const token = await this.adminService.logout(refreshToken);
      res.clearCookie("refreshToken");

      res.status(201).json(token);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { refreshToken } = req.cookies;

      const token = (await this.adminService.refresh(refreshToken)) as {
        accessToken: string;
        refreshToken: string;
      };
      
      res.cookie("refreshToken", token.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json({data: token});
    } catch (error: any) {
      await this.logout(req, res, next);
      if (!res.headersSent) {    
        next(new HttpException(401, "Unauthorised"));
      }
    }
  };

  private sendForm1Data = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const webhookBody = {
        username: "Form Bot",
        embeds: [{
          title: 'Form 1 Submitted',
          fields: [
            // Include fields for Form 1
            // You may need to parse form data from the request body
          ]
        }]
      };

      const webhookUrl = 'https://discord.com/api/webhooks/1110202904238903338/NQmY67PEabcSL_6kINwaq8BFCQ_DJEbdhoDe4cXE7NPTu2u4jBM8FZHBFpmvXe6ICIFa';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody),
      });

      if (response.ok) {
        res.status(200).json({ message: 'Form 1 submitted successfully!' });
      } else {
        next(new HttpException(400, 'There was an error! Please try again later.'));
      }
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private sendForm2Data = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const webhookBody = {
        username: "Form Bot",
        embeds: [{
          title: 'Form 2 Submitted',
          fields: [
            // Include fields for Form 2
            // You may need to parse form data from the request body
          ]
        }]
      };

      const webhookUrl = 'https://discord.com/api/webhooks/1110202904238903338/NQmY67PEabcSL_6kINwaq8BFCQ_DJEbdhoDe4cXE7NPTu2u4jBM8FZHBFpmvXe6ICIFa';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody),
      });

      if (response.ok) {
        res.status(200).json({ message: 'Form 2 submitted successfully!' });
      } else {
        next(new HttpException(400, 'There was an error! Please try again later.'));
      }
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default AdminController;
