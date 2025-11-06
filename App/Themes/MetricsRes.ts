// utils/MetricsRes.ts
import {Dimensions} from 'react-native';
import {scale, verticalScale, moderateScale} from '../Utils//ScaleUtils';

const {width, height} = Dimensions.get('window');

const MetricsRes = {
  screenWidth: width,
  screenHeight: height,

  margin: {
    tiny: moderateScale(4),
    small: moderateScale(8),
    base: moderateScale(12),
    medium: moderateScale(16),
    large: moderateScale(24),
    x_large: moderateScale(32),
    huge: moderateScale(40),
    x_huge: moderateScale(60),
    xx_huge: moderateScale(80),
    oneFifth: height / 5,
    quarterScreen: height / 4,
  },

  icons: {
    tiny: scale(14),
    small: scale(18),
    base: scale(24),
    large: scale(32),
    x_large: scale(40),
    xx_large: scale(48),
    huge: scale(60),
    iconStar: scale(18),
  },

  images: {
    banner: {
      small: verticalScale(80),
      base: verticalScale(120),
    },
    poster: {
      xx_small: verticalScale(80),
      x_small: verticalScale(120),
      xs_small: verticalScale(140),
      small: verticalScale(160),
      base: verticalScale(200),
      large: verticalScale(240),
      x_large: verticalScale(280),
    },
    avatar: {
      small: scale(50),
      base: scale(80),
      large: scale(100),
    },
  },

  logo: {
    regular: scale(120),
    large: scale(160),
  },

  radius: {
    base: moderateScale(8),
    large: moderateScale(12),
    circle: scale(999),
  },

  border: {
    base: 0.5,
    medium: 0.8,
    large: 1,
  },
};

export default MetricsRes;
