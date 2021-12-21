import { sanityClient } from "../../../sanity";
import Image from "../../../components/Image";
import Map from "../../../components/Map";
import Link from "next/link";

const Property = ({
  title,
  location,
  propertyType,
  mainImage,
  images,
  pricePerAssets,
  telephone,
  address,
  description,
  adminhost,
  propertySlug, // plus: slug property yang sedang diakses
  closestUniSlug // plus: slug universitas yang terdekat
}) => {
  // console.log(images);
  return (
    <div className="container">
      <h1>
        <b>{title}</b>
      </h1>

      <div className="images-section">
        <Image identifier="main-image" image={mainImage} />
        <div className="sub-images-section">
          {images.map(({ _key, asset }, image) => (
            <Image key={_key} identifier="image" image={asset} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="information">
          <h2>
            <b>
              {propertyType?.name} hosted by {adminhost?.name}
            </b>
          </h2>
          <h4>
            Address: {address} , Telephone: {telephone}
          </h4>
          <hr />
          <h4>{description}</h4>
          <h4>
            <b>Enhanced Clean</b>
          </h4>
          <p>
            Ciputra Group is committed to Ciputra enhanced Hygine and
            cleanliness process.
          </p>
          <h4>
            <b> Ciputra for everyday living!</b>
          </h4>
          <p>
            Ciputra Jakarta is one of the most strategic locations. The hotel
            boasts spacious spring-cleaned guest rooms of flexible
            configurations plus excellent city views, the comfortable all-day
            dining The Gallery Restaurant, the Executive Lounge with the best
            views, Large high ceiling ballrooms to cater up to 1,500 delegates,
            and a fabulous wellness center with a tropical swimming pool.
          </p>
          <h4>
            <b>Safety Commitments </b>
          </h4>
          <p>
            Ciputra Group focuses daily to adhere fully to the highest
            sanitation, hygiene, health, safety protocol standards as currently
            stipulated by the World Health Organization and the 10 Health,
            Safety, Hygiene Commitments. Ciputra Group strictly apply the new
            global health and safety standards as your safety and health is our
            priority. Ciputra Group have been certified by multiple
            certification authorities, such as TUVR for HACCP (Hazard Analysis
            Critical Control Point) certification, Bureau Veritas for
            Coronavirus free environment, and ECOLAB worldwide standards
            compliant for our housekeeping and kitchen operations.
          </p>
        </div>
        <div className="price-box">
          <h2>Total Asset = Rp. {pricePerAssets}</h2>

          {/* <Link href={`university/[university.js]`}>
            <div className="button">is Closest to..</div>
          </Link> */}

          {/* plus: Membuat link dari slug property yang sedang diakses & universitas terdekat */}
          <Link href={{
            pathname: propertySlug + '/university/' + closestUniSlug,
            query: {}
          }}>
            <div className="button">is Closest to..</div>
          </Link>
        </div>
      </div>

      <hr />

      <h2>Location</h2>
      <Map location={location}></Map>
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    id,
    title,
    location,
    propertyType->{
      _id,
      name,
      slug,
    },
    mainImage,
    images,
    pricePerAssets,
    telephone,
    address,
    description,
    adminhost->{
      _id,
      name,
      slug,
      image
    },
  }`;

  const property = await sanityClient.fetch(query, { pageSlug });
  // console.log(property);

  // closestOne(property);
  const universitySlug = await closestOne(property);

  console.log("University slug", universitySlug);
  
  if (!property) {
    return {
      props: null,
      notFound: true,
    };
  } else {
    return {
      props: {
        title: property.title,
        location: property.location,
        propertyType: property.propertyType,
        mainImage: property.mainImage,
        images: property.images,
        pricePerAssets: property.pricePerAssets,
        telephone: property.telephone,
        address: property.address,
        description: property.description,
        adminhost: property.adminhost,
        closestUniSlug: universitySlug,
        propertySlug: pageSlug
      },
    };
  }
};

const closestOne = async (currentProperty) => {
  // console.log("?");

  //fetch database property
  const query = '*[ _type == "university"]'; // plus: Dapatkan semua list universitas untuk dicocokan distancenya dengan lokasi property yang sedang dilihat

  const properties = await sanityClient.fetch(query);

  //delete attributes
  properties.forEach((element) => {
    delete element["description"];
    delete element["adminhost"];
    delete element["images"];
    delete element["pricePerAssets"];
    delete element["telephone"];
    delete element["_updatedAt"];
    delete element["mainImage"];
    delete element["address"];
    delete element["_createdAt"];
    delete element["_type"];
    delete element["_rev"];
    delete element["propertyType"];
    // delete element["slug"];
  });

  //new name (list of props)
  const listProps = properties;

  console.log("--------------------------------");
  // console.log(currentProperty.location);
  const curProp = currentProperty.location; //assign ke var karena terlalu bnyk attribute
  // console.log(curProp);
  // console.log(currentProperty);
  // console.log(listProps);
  // console.log(curProp);

  const distanceList = [];

  listProps.forEach((element) => {
    // console.log("Element", element);

    // console.log(element.location.lat);
    const dist = getDistance(
      curProp.lat, // plus: lokasi property yang sedang dilihat
      curProp.lng,
      element.location.lat, // plus: lokasi universitas
      element.location.lng
    );
    // console.log(dist); //list distance!!
    if (dist == 0) {
      return;
    }
    var tmp = {
      distance: dist,
      propertyID: element.propertyID,
      slug: element.slug // plus: tambahkan slug
    };
    distanceList.push(tmp);
  });
//menggunakan fungsi min
  console.log(distanceList);

  // console.log(distanceList);
  let MinNumber = 99999999999;
  // let propertyID = null; 
  let universitySlug = null;

  distanceList.forEach((element) => {
    if (element.distance < MinNumber) {
      MinNumber = element.distance;
      // propertyID = element.propertyID;
      universitySlug = element.slug.current // plus: pass slug university yang paling dekat
    }
  });

  console.log(MinNumber, universitySlug); // plus: menunjukan slug universitas yang terdekat

  return universitySlug;
};
const getDistance = (x1, y1, x2, y2) => {
  // https://www.movable-type.co.uk/scripts/latlong.html
  const R = 6371e3;
  const φ1 = (x1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (x2 * Math.PI) / 180;
  const Δφ = ((x2 - x1) * Math.PI) / 180;
  const Δλ = ((y2 - y1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};

export default Property;
