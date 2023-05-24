import Page from './page';

export default async function Default({ ...props }) {
  // @ts-ignore
  return <Page {...props} />;
}
