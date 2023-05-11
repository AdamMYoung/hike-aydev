const About = async () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <p>
        This site provides a simple way to track your progress on Wainwrights and other fells across the British Isles.
        The project is built using Next.JS, making use of React Server Components and Server Actions which are currently
        in beta.
      </p>
      <p>
        Fell data is provided by{" "}
        <a className="underline hover:no-underline" href="http://www.hills-database.co.uk/index.html">
          The Database of British and Irish Hills
        </a>
        , with map information provided by{" "}
        <a className="underline hover:no-underline" href="https://www.openstreetmap.org/">
          OpenStreetMap
        </a>
        .
      </p>
    </div>
  );
};

export default About;
