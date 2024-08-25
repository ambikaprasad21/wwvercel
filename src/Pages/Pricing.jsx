// Uses the same styles as Product
import PageNav from "../components/PageNav";
import styles from "./Product.module.css";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <div>
          <h2>
            Simple pricing.
            <br />
            Just $9/month.
          </h2>
          <p>
            Enjoy all the features of WorldWise for just $9 per month. No hidden
            fees or complicated tiers—just simple, transparent pricing. Whether
            you're an occasional traveler or an avid explorer, our pricing
            ensures you get the best value while documenting your journeys.
            Start today and experience the convenience of tracking your travels
            with ease.
          </p>
        </div>
        <img src="img-2.jpg" alt="overview of a large city with skyscrapers" />
      </section>
    </main>
  );
}
