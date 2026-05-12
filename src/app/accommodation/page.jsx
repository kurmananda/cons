import SimplePageShell from '../components/SimplePageShell';

export const metadata = {
  title: 'Accommodation | Conscientia IIST',
  description: 'Visitor accommodation information for Conscientia at IIST.',
};

export default function AccommodationPage() {
  return (
    <SimplePageShell
      title="Accommodation"
      subtitle="Outstation teams and guests — policies, hostel blocks, and partner hotels will be published here."
    >
      <p>
        Placeholder accommodation guide. Final content will include eligibility, pricing slabs,
        check-in windows, and a link to the official registration form once logistics are
        confirmed with institute administration.
      </p>
      <p>
        For urgent mobility or accessibility needs, use the contact page once live routing is
        enabled.
      </p>
    </SimplePageShell>
  );
}
