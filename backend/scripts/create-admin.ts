import prisma from '../src/config/database';
import bcrypt from 'bcrypt';

async function createAdmin() {
  const email = 'admin@businessqoldau.kz';
  const password = 'Admin2025!Secure';

  try {
    // Проверяем, существует ли уже такой пользователь
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ Пользователь с email', email, 'уже существует');

      // Обновляем роль на admin, если пользователь существует
      const updatedUser = await prisma.users.update({
        where: { email },
        data: { role: 'admin' }
      });

      console.log('✅ Роль пользователя обновлена на admin');
      console.log('📧 Email:', updatedUser.email);
      console.log('👤 Role:', updatedUser.role);
      console.log('🔑 ID:', updatedUser.id);

      await prisma.$disconnect();
      return;
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаем нового администратора
    const admin = await prisma.users.create({
      data: {
        email,
        password_hash: passwordHash,
        email_verified: true,  // Сразу верифицируем
        role: 'admin'
      }
    });

    console.log('✅ Администратор успешно создан!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Пароль:', password);
    console.log('👤 Role:', admin.role);
    console.log('🔑 ID:', admin.id);
    console.log('');
    console.log('⚠️  ВАЖНО: Сохраните эти данные в надежном месте!');
    console.log('⚠️  Рекомендуется сменить пароль после первого входа.');

  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
