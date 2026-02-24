import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getEmailSignature = (): string => {
  return `
    <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333; margin-top: 40px; padding-top: 20px; border-top: 2px solid #2563eb;">
      <tr>
        <td>
          <p style="margin: 0 0 15px 0; font-size: 16px;">
            С уважением,<br>
            <strong style="color: #2563eb;">Команда Business Qoldau 2025</strong>
          </p>

          <table cellpadding="0" cellspacing="0" style="margin: 15px 0;">
            <tr>
              <td style="padding: 8px 0;">
                <strong>🌐 Веб-сайт:</strong>
                <a href="https://businessqoldau.kz" style="color: #2563eb; text-decoration: none; margin-left: 5px;">businessqoldau.kz</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>✉ Email:</strong>
                <a href="mailto:info@businessqoldau.kz" style="color: #2563eb; text-decoration: none; margin-left: 5px;">info@businessqoldau.kz</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>📞 Телефон:</strong>
                <a href="tel:+77772600038" style="color: #2563eb; text-decoration: none; margin-left: 5px;">+7 (777) 260-00-38</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>💬 Telegram:</strong>
                <a href="https://t.me/+XGtS6cT6QXE5Mjli" style="color: #2563eb; text-decoration: none; margin-left: 5px;">Присоединиться к каналу</a>
              </td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.6;">
              Это автоматическое письмо. Пожалуйста, не отвечайте на него.<br>
              Если у вас есть вопросы, свяжитесь со службой поддержки:
              <a href="mailto:info@businessqoldau.kz" style="color: #2563eb; text-decoration: none;">info@businessqoldau.kz</a>
            </p>
          </div>

          <div style="margin-top: 15px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af;">
              © 2025 Business Qoldau. Все права защищены.
            </p>
          </div>
        </td>
      </tr>
    </table>
  `;
};

export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  const mailOptions = {
    from: `"Business Qoldau 2025" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Код подтверждения email - Business Qoldau 2025',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Business Qoldau 2025</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Республиканский бизнес-конкурс</p>
        </div>

        <!-- Content -->
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Добро пожаловать!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Спасибо за регистрацию на платформе Business Qoldau 2025.
            Введите этот код для подтверждения вашего email адреса:
          </p>

          <!-- Verification Code -->
          <div style="text-align: center; margin: 35px 0;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 25px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
              <div style="background-color: #ffffff; padding: 15px 30px; border-radius: 8px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #2563eb; font-family: 'Courier New', monospace;">
                  ${code}
                </span>
              </div>
            </div>
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 25px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏱ <strong>Важно:</strong> Код действителен в течение 15 минут.
            </p>
          </div>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
          <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
            🔒 <strong>Безопасность:</strong> Никогда не сообщайте этот код третьим лицам.
            Сотрудники Business Qoldau никогда не попросят вас предоставить код подтверждения.
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 20px 0;">
          Если вы не регистрировались на платформе Business Qoldau 2025, просто проигнорируйте это письмо.
          Ваши данные в безопасности.
        </p>

        ${getEmailSignature()}
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, code: string): Promise<void> => {
  const mailOptions = {
    from: `"Business Qoldau 2025" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Код восстановления пароля - Business Qoldau 2025',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Business Qoldau 2025</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Республиканский бизнес-конкурс</p>
        </div>

        <!-- Content -->
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🔑 Восстановление пароля</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Вы запросили восстановление пароля для вашего аккаунта на платформе Business Qoldau 2025.
            Введите этот код для подтверждения:
          </p>

          <!-- Reset Code -->
          <div style="text-align: center; margin: 35px 0;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 25px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
              <div style="background-color: #ffffff; padding: 15px 30px; border-radius: 8px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #2563eb; font-family: 'Courier New', monospace;">
                  ${code}
                </span>
              </div>
            </div>
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 25px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏱ <strong>Важно:</strong> Код действителен в течение 15 минут.
            </p>
          </div>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
          <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
            🔒 <strong>Безопасность:</strong> Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
            Ваш пароль останется без изменений. Никому не сообщайте этот код.
          </p>
        </div>

        ${getEmailSignature()}
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendContactNotification = async (
  name: string,
  email: string,
  message: string
): Promise<void> => {
  const mailOptions = {
    from: `"Business Qoldau 2025" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📬 Новое сообщение от ${name} - Business Qoldau`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 12px 12px 0 0; padding: 30px; text-align: center; margin: -20px -20px 20px -20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📬 Новое сообщение</h1>
          <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px;">Форма обратной связи Business Qoldau 2025</p>
        </div>

        <!-- Contact Info -->
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
          <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151; font-size: 14px;">👤 Имя:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                <span style="color: #1f2937; font-size: 14px;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151; font-size: 14px;">✉ Email:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">
                <strong style="color: #374151; font-size: 14px;">📅 Дата:</strong>
              </td>
              <td style="padding: 10px 0; text-align: right;">
                <span style="color: #1f2937; font-size: 14px;">${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Message -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">💬 Сообщение:</h3>
          <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; line-height: 1.6;">
            <p style="margin: 0; color: #1f2937; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <!-- Quick Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${email}"
             style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 14px 35px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    font-weight: bold;
                    font-size: 15px;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
            ↩ Ответить
          </a>
        </div>

        <!-- Admin Notice -->
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
            ℹ <strong>Для администратора:</strong> Это автоматическое уведомление с формы обратной связи сайта businessqoldau.kz.
            Рекомендуется ответить пользователю в течение 24 часов.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <div style="text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">
            © 2025 Business Qoldau. Панель администратора.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send application status update notification to user
 */
export const sendApplicationStatusEmail = async (
  email: string,
  fullName: string,
  status: 'accepted' | 'rejected' | 'revision',
  message: string,
  applicationData: {
    category: string;
    createdAt: Date;
  }
): Promise<void> => {
  const isAccepted = status === 'accepted';
  const isRevision = status === 'revision';
  const categoryLabels: Record<string, string> = {
    starter: 'Стартап',
    active: 'Активный бизнес',
    it: 'IT проект'
  };

  const statusTitle = isAccepted
    ? '🎉 Ваша заявка принята!'
    : isRevision
    ? '📝 Заявка требует доработки'
    : 'Результат рассмотрения заявки';
  const statusColor = isAccepted ? '#10b981' : isRevision ? '#3b82f6' : '#f59e0b';
  const statusBgColor = isAccepted ? '#d1fae5' : isRevision ? '#dbeafe' : '#fef3c7';
  const statusTextColor = isAccepted ? '#065f46' : isRevision ? '#1e40af' : '#92400e';
  const gradientStart = isAccepted ? '#10b981' : isRevision ? '#3b82f6' : '#f59e0b';
  const gradientEnd = isAccepted ? '#059669' : isRevision ? '#2563eb' : '#d97706';

  const mailOptions = {
    from: `"Business Qoldau 2025" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${isAccepted ? '✅' : '📋'} ${statusTitle} - Business Qoldau 2025`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Business Qoldau 2025</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Республиканский бизнес-конкурс</p>
        </div>

        <!-- Status Banner -->
        <div style="background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">${statusTitle}</h2>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
          <p style="color: #1f2937; font-size: 16px; margin: 0;">
            Здравствуйте, <strong>${fullName}</strong>!
          </p>
        </div>

        <!-- Application Info -->
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Информация о заявке:</h3>
          <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Категория:</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">
                <strong>${categoryLabels[applicationData.category] || applicationData.category}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Дата подачи:</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">
                ${new Date(applicationData.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Статус:</td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="background-color: ${statusBgColor}; color: ${statusTextColor}; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                  ${isAccepted ? '✓ Принята' : isRevision ? '📝 На доработке' : 'Отклонена'}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Message from Admin -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">💬 Сообщение от организаторов:</h3>
          <div style="background-color: #ffffff; border: 2px solid ${statusColor}; border-radius: 12px; padding: 20px; line-height: 1.6;">
            <p style="margin: 0; color: #1f2937; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        ${isAccepted ? `
        <!-- Next Steps (for accepted) -->
        <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
            ℹ <strong>Следующие шаги:</strong> В ближайшее время с вами свяжутся представители Business Qoldau для предоставления дальнейших инструкций.
            Следите за обновлениями в личном кабинете.
          </p>
        </div>
        ` : isRevision ? `
        <!-- Revision instructions -->
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
            📝 <strong>Необходимые действия:</strong> Ознакомьтесь с замечаниями выше и внесите необходимые изменения в вашу заявку.
            После внесения изменений отправьте заявку повторно через личный кабинет.
          </p>
        </div>
        ` : `
        <!-- Encouragement (for rejected) -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
            💡 <strong>Не отчаивайтесь!</strong> Мы ценим ваше участие и предлагаем использовать полученный опыт для развития вашего бизнеса.
            Следите за анонсами новых возможностей на нашем сайте.
          </p>
        </div>
        `}

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://businessqoldau.kz'}/app"
             style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 14px 35px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    font-weight: bold;
                    font-size: 15px;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
            Перейти в личный кабинет
          </a>
        </div>

        ${getEmailSignature()}
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send reply to contact form submission
 */
export const sendContactReplyEmail = async (
  userEmail: string,
  userName: string,
  originalMessage: string,
  replyMessage: string
): Promise<void> => {
  const mailOptions = {
    from: `"Business Qoldau 2025" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: 'Ответ на ваше обращение - Business Qoldau 2025',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Business Qoldau 2025</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Республиканский бизнес-конкурс</p>
        </div>

        <!-- Greeting -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">📬 Ответ на ваше обращение</h2>
        </div>

        <div style="margin-bottom: 25px;">
          <p style="color: #1f2937; font-size: 16px; margin: 0;">
            Здравствуйте, <strong>${userName}</strong>!
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">
            Спасибо за ваше обращение. Мы рады ответить на ваш вопрос.
          </p>
        </div>

        <!-- Your original message -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Ваше обращение:</h3>
          <div style="background-color: #f9fafb; border-left: 4px solid #d1d5db; border-radius: 8px; padding: 15px; line-height: 1.6;">
            <p style="margin: 0; color: #6b7280; font-style: italic; white-space: pre-wrap;">${originalMessage}</p>
          </div>
        </div>

        <!-- Reply from admin -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">💬 Ответ:</h3>
          <div style="background-color: #ffffff; border: 2px solid #2563eb; border-radius: 12px; padding: 20px; line-height: 1.6;">
            <p style="margin: 0; color: #1f2937; white-space: pre-wrap;">${replyMessage}</p>
          </div>
        </div>

        <!-- Additional questions -->
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
            ℹ <strong>Остались вопросы?</strong> Вы можете связаться с нами по email
            <a href="mailto:info@businessqoldau.kz" style="color: #2563eb; text-decoration: none;">info@businessqoldau.kz</a>
            или позвонить по телефону <a href="tel:+77772600038" style="color: #2563eb; text-decoration: none;">+7 (777) 260-00-38</a>
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://businessqoldau.kz'}"
             style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 14px 35px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    font-weight: bold;
                    font-size: 15px;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
            Перейти на сайт
          </a>
        </div>

        ${getEmailSignature()}
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};