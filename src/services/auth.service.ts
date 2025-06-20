import jwt from 'jsonwebtoken';
import { UsersCollection, UserDocument } from '../models/user.model';
import { jwtConfig } from '../config/jwt';
import { AppError } from '../utils/error';
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from '../utils/http-status';

const signUp = async (userData: {
  email: string;
  password: string;
}): Promise<{ user: UserDocument; accessToken: string; refreshToken: string }> => {
  const existingUser = await UsersCollection.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already exists', BAD_REQUEST);
  }

  const user = await UsersCollection.create(userData);
  const { accessToken, refreshToken } = await generateTokens(user);

  return { user, accessToken, refreshToken };
}

const signIn = async (email: string, password: string): Promise<{
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}> => {
  const user = await UsersCollection.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', UNAUTHORIZED);
  }

  const { accessToken, refreshToken } = await generateTokens(user);
  return { user, accessToken, refreshToken };
}

const refreshToken = async (token: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      user: {
        id: string;
        email: string;
        role: string;
      };
      type: string;
    };

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', UNAUTHORIZED);
    }

    const user = await UsersCollection.findOne({ id: decoded.user.id });
    if (!user) {
      throw new AppError('User not found or inactive', UNAUTHORIZED);
    }

    return generateTokens(user);
  } catch (error) {
    throw new AppError('Invalid refresh token', UNAUTHORIZED);
  }
};  

const deleteAccount = async (userId: string): Promise<void> => {
  const user = await UsersCollection.findOne({ id: userId });
  if (!user) {
    throw new AppError('User not found', NOT_FOUND);
  }

  await UsersCollection.deleteOne({ id: userId });
};

const generateTokens = async (
  user: UserDocument
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = jwt.sign(
    {
      type: 'access',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    jwtConfig.secret,
    jwtConfig.accessToken.options
  );

  const refreshToken = jwt.sign(
    {
      type: 'refresh',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    jwtConfig.secret,
    jwtConfig.refreshToken.options
  );

  return { accessToken, refreshToken };
};

export {
  signUp,
  signIn,
  refreshToken,
  deleteAccount,
  generateTokens,
};
