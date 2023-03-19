// Classe qui permet d'obtenir des nombres complexes et de calculer avec
class Complex {
    constructor(a, b) {
        this.re = a;
        this.im = b;
    }
// Ajouter deux nombres complexes
    add(c) {
        this.re += c.re;
        this.im += c.im;
    }
// Faire le produit de deux nommbres complexes
    mult(c) {
        const re = this.re * c.re - this.im * c.im;
        const im = this.re * c.im + this.im * c.re;
        return new Complex(re, im);
    }
}

// Fonction qui effectue la transformation de Fourier 
// Renvoie la partie réelle et imaginaire du nombre 
// Renvoie aussi la fréquence, l'amplitude et la phase de l'épicycle à tracer 

// La formule qui permet d'obtenir ces valeurs et présent dans la page wikipedia:
// https://en.wikipedia.org/wiki/Discrete_Fourier_transform
// il s'agit de l'équation 1 
function dft(x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
      let sum = new Complex(0,0);
      for (let n = 0; n < N; n++) {
        const phi = (TWO_PI * k * n) / N;
        const c = new Complex(cos(phi), -sin(phi));
        sum.add(x[n].mult(c));
      }
      sum.re = sum.re / N;
      sum.im = sum.im / N;
  
      let freq = k;
    //   L'amplitude est calculé avec le théorème de Pythagore
      let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    //   La pahse est calculé à l'aide de la trigonométrie
      let phase = atan2(sum.im, sum.re);
      X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
    }
    return X;
  }
