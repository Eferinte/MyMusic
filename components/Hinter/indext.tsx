interface Props {
  message: string;
}
export const Hinter = (props: Props) => {
  const { message } = props;
  window.alert(message);
};
