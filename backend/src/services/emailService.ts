import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { AppError } from '../utils/appError';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface EmailConfig {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
}

interface EmailLog {
  to_email: string;
  subject: string;
  status: 'sent' | 'failed' | 'bounced';
  error_message?: string;
}

export class EmailService {
  /**
   * Obtener configuración de email desde Supabase
   */
  static async getEmailConfig(): Promise<EmailConfig> {
    try {
      const { data: config, error } = await supabase
        .from('email_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error || !config) {
        throw new AppError('No email configuration found', 500);
      }

      return {
        smtp_host: config.smtp_host,
        smtp_port: config.smtp_port,
        smtp_user: config.smtp_user,
        smtp_password: config.smtp_password,
        from_email: config.from_email,
        from_name: config.from_name,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error getting email configuration', 500);
    }
  }

  /**
   * Crear transportador SMTP
   */
  static async createTransporter() {
    const config = await this.getEmailConfig();
    
    return nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: config.smtp_user,
        pass: config.smtp_password,
      },
    });
  }

  /**
   * Enviar email
   */
  static async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<boolean> {
    try {
      const config = await this.getEmailConfig();
      const transporter = await this.createTransporter();

      const mailOptions = {
        from: `"${config.from_name}" <${config.from_email}>`,
        to,
        subject,
        text,
        html: html || text,
      };

      const info = await transporter.sendMail(mailOptions);
      
      // Registrar envío exitoso
      await this.logEmail({
        to_email: to,
        subject,
        status: 'sent',
      });

      console.log('✅ Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      
      // Registrar error
      await this.logEmail({
        to_email: to,
        subject,
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      return false;
    }
  }

  /**
   * Enviar email de bienvenida
   */
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = '¡Bienvenido a Suite Arqueológica!';
    const text = `Hola ${userName},\n\n¡Bienvenido a Suite Arqueológica! Tu cuenta ha sido creada exitosamente.\n\nSaludos,\nEl equipo de Suite Arqueológica`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">¡Bienvenido a Suite Arqueológica!</h1>
        <p>Hola <strong>${userName}</strong>,</p>
        <p>¡Tu cuenta ha sido creada exitosamente!</p>
        <p>Ya puedes comenzar a usar todas las herramientas de arqueología digital.</p>
        <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
        <p style="color: #7f8c8d; font-size: 14px;">
          Saludos,<br>
          El equipo de Suite Arqueológica
        </p>
      </div>
    `;

    return this.sendEmail(userEmail, subject, text, html);
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  static async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Recuperación de Contraseña - Suite Arqueológica';
    const text = `Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace: ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Recuperación de Contraseña</h1>
        <p>Has solicitado recuperar tu contraseña en Suite Arqueológica.</p>
        <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
        <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
        <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
        <p style="color: #7f8c8d; font-size: 14px;">
          Saludos,<br>
          El equipo de Suite Arqueológica
        </p>
      </div>
    `;

    return this.sendEmail(userEmail, subject, text, html);
  }

  /**
   * Enviar email de notificación
   */
  static async sendNotificationEmail(
    userEmail: string,
    title: string,
    message: string
  ): Promise<boolean> {
    const subject = `Notificación - ${title}`;
    const text = message;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">${title}</h1>
        <p>${message}</p>
        <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
        <p style="color: #7f8c8d; font-size: 14px;">
          Saludos,<br>
          El equipo de Suite Arqueológica
        </p>
      </div>
    `;

    return this.sendEmail(userEmail, subject, text, html);
  }

  /**
   * Registrar envío de email en logs
   */
  static async logEmail(log: EmailLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('email_logs')
        .insert([log]);

      if (error) {
        console.error('Error logging email:', error);
      }
    } catch (error) {
      console.error('Error logging email:', error);
    }
  }

  /**
   * Obtener estadísticas de emails
   */
  static async getEmailStats(): Promise<{
    total: number;
    sent: number;
    failed: number;
    bounced: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('status');

      if (error) {
        throw new AppError('Error getting email stats', 500);
      }

      const stats = {
        total: data?.length || 0,
        sent: data?.filter(log => log.status === 'sent').length || 0,
        failed: data?.filter(log => log.status === 'failed').length || 0,
        bounced: data?.filter(log => log.status === 'bounced').length || 0,
      };

      return stats;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error getting email stats', 500);
    }
  }

  /**
   * Limpiar logs antiguos
   */
  static async cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_old_email_logs', {
        days_to_keep: daysToKeep,
      });

      if (error) {
        throw new AppError('Error cleaning up old logs', 500);
      }

      return data || 0;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error cleaning up old logs', 500);
    }
  }

  /**
   * Verificar configuración de email
   */
  static async testEmailConfig(): Promise<boolean> {
    try {
      const config = await this.getEmailConfig();
      const transporter = await this.createTransporter();
      
      // Verificar conexión
      await transporter.verify();
      
      console.log('✅ Configuración de email válida');
      return true;
    } catch (error) {
      console.error('❌ Error en configuración de email:', error);
      return false;
    }
  }
} 