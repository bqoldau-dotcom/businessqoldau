import ExcelJS from 'exceljs';
import prisma from '../config/database';

/**
 * Export all applications to Excel file
 * Returns Excel workbook buffer
 */
export const exportApplicationsToExcel = async () => {
  // Fetch ALL applications with user and profile data
  const applications = await prisma.application.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: {
            select: {
              fullName: true,
              phone: true,
              city: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Заявки');

  // Define columns
  worksheet.columns = [
    { header: '№', key: 'number', width: 8 },
    { header: 'ID заявки', key: 'id', width: 15 },
    { header: 'ФИО', key: 'fullName', width: 30 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Телефон', key: 'phone', width: 18 },
    { header: 'Город', key: 'city', width: 20 },
    { header: 'Категория', key: 'category', width: 20 },
    { header: 'Описание бизнеса', key: 'summary', width: 50 },
    { header: 'Статус файла', key: 'fileStatus', width: 20 },
    { header: 'Дата создания', key: 'createdAt', width: 20 },
    { header: 'Дата обновления', key: 'updatedAt', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Add data rows
  applications.forEach((app, index) => {
    const categoryLabels: Record<string, string> = {
      starter: 'Стартап',
      active: 'Активный бизнес',
      it: 'IT проект',
    };

    worksheet.addRow({
      number: index + 1,
      id: app.id.substring(0, 8) + '...',
      fullName: app.user?.profile?.fullName || 'Не указано',
      email: app.user?.email || 'Не указано',
      phone: app.user?.profile?.phone || 'Не указано',
      city: app.user?.profile?.city || 'Не указано',
      category: categoryLabels[app.category] || app.category,
      summary: app.summary,
      fileStatus: app.planFilePath ? 'Загружен' : 'Не загружен',
      createdAt: new Date(app.createdAt).toLocaleString('ru-RU'),
      updatedAt: new Date(app.updatedAt).toLocaleString('ru-RU'),
    });
  });

  // Enable filters on header row
  worksheet.autoFilter = {
    from: 'A1',
    to: 'K1',
  };

  // Add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

/**
 * Export all users to Excel file
 * Returns Excel workbook buffer
 */
export const exportUsersToExcel = async () => {
  // Fetch ALL users with profile data
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailVerified: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          fullName: true,
          phone: true,
          city: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Пользователи');

  // Define columns
  worksheet.columns = [
    { header: '№', key: 'number', width: 8 },
    { header: 'ID пользователя', key: 'id', width: 15 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Email верифицирован', key: 'emailVerified', width: 20 },
    { header: 'ФИО', key: 'fullName', width: 30 },
    { header: 'Телефон', key: 'phone', width: 18 },
    { header: 'Город', key: 'city', width: 20 },
    { header: 'Роль', key: 'role', width: 15 },
    { header: 'Дата регистрации', key: 'createdAt', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Add data rows
  users.forEach((user, index) => {
    const roleLabels: Record<string, string> = {
      user: 'Пользователь',
      admin: 'Администратор',
    };

    worksheet.addRow({
      number: index + 1,
      id: user.id.substring(0, 8) + '...',
      email: user.email,
      emailVerified: user.emailVerified ? 'Да' : 'Нет',
      fullName: user.profile?.fullName || '—',
      phone: user.profile?.phone || '—',
      city: user.profile?.city || '—',
      role: roleLabels[user.role] || user.role,
      createdAt: new Date(user.createdAt).toLocaleString('ru-RU'),
    });
  });

  // Enable filters on header row
  worksheet.autoFilter = {
    from: 'A1',
    to: 'I1',
  };

  // Add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
