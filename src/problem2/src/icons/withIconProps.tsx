export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const withIconProps =
  (Component: React.ComponentType<React.SVGProps<SVGSVGElement>>) =>
  ({ size = 16, width, height, ...restProps }: IconProps) => {
    return <Component width={width || height ? width : size} height={width || height ? height : size} {...restProps} />;
  };
