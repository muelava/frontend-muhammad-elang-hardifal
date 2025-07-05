import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormCard from "@/components/FormCard";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <Header />

          {/* Form Card */}
          <FormCard />

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
