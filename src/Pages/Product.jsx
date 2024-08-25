import PageNav from "../components/PageNav";
import styles from "./Product.module.css";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <img
          src="img-1.jpg"
          alt="person with dog overlooking mountain with sunset"
        />
        <div>
          <h2>About WorldWide.</h2>
          <p>
            WorldWise is an innovative travel journaling platform designed to
            help users effortlessly log and track their journeys. With an
            interactive map at its core, WorldWise allows users to record the
            places they've visited, attach notes, and revisit their experiences
            at any time. Whether for personal reflection or sharing with others,
            WorldWise provides a seamless and intuitive way to document and
            relive travel memories.
          </p>
          <p>
            The platform’s clean interface and real-time location features
            ensure that users can easily manage and explore their travel history
            in one convenient place.
          </p>
        </div>
      </section>
    </main>
  );
}
